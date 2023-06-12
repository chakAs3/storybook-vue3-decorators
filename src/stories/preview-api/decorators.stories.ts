import Pre from '../../components/Pre.vue';
import type {
  ArgsStoryFn,
  PartialStoryFn,
  PlayFunctionContext,
  StoryContext,
} from '@storybook/types';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { useEffect } from '@storybook/preview-api';
import { STORY_ARGS_UPDATED, UPDATE_STORY_ARGS, RESET_STORY_ARGS } from '@storybook/core-events';

export default {
  component: Pre,
  parameters: { useProjectDecorator: true },
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { ...context.args, text: `component ${context.args['text']}` } }),
  ],
};

export const Inheritance = {
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { ...context.args, text: `story ${context.args['text']}` } }),
  ],
  args: {
    text: 'starting',
  },
  play: async ({ canvasElement }: PlayFunctionContext<any>) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('pre').innerText).toEqual('story component project starting');
  },
};


// Issue: https://github.com/storybookjs/storybook/issues/22945
export const Hooks = {
  decorators: [
    // decorator that uses hooks
    (storyFn: PartialStoryFn, context: StoryContext) => {
      useEffect(() => {});

      return storyFn({ args: { ...context.args, text: `decoratorA ( ${context.args['text']} )` } });
    },
    (storyFn: PartialStoryFn, context: StoryContext) => {
      useEffect(() => {});

      return storyFn({ args: { ...context.args, text: `decoratorB ( ${context.args['text']} )` } });
    },
    // conditional decorator, runs before the above
    (storyFn: PartialStoryFn, context: StoryContext) => {
      return context.args.condition
        ? storyFn()
        : null;
    },
  ],
  args: {
    text: 'text',
    condition: true,
  },
  play: async ({ id, args }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { condition: false },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
  },
};
