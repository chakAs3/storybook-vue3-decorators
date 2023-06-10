import type { Preview } from "@storybook/vue3";
import type { PartialStoryFn, StoryContext } from '@storybook/types';

export const parameters = {
  projectParameter: 'projectParameter',
  storyObject: {
    a: 'project',
    b: 'project',
    c: 'project',
  },
};


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  (storyFn: PartialStoryFn, context: StoryContext) => {
    if (context.parameters['useProjectDecorator'])
      return storyFn({ args: { ...context.args, text: `project ${context.args.text}` } });
    return storyFn();
  },
];

export default preview;
