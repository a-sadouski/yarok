export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      neutral: 'slate',
    },

    input: {
      slots: {
        base: 'w-full rounded-xl !bg-white !text-primary-700 placeholder:text-slate-400',
      },
      defaultVariants: {
        variant: 'outline',
        size: 'xl',
      },
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
    },
    textarea: {
      slots: {
        base: 'w-full rounded-xl !bg-white !text-primary-700 placeholder:text-slate-400',
      },
      variants: {
        variant: {
          outline: {
            base: '!bg-slate-50 !ring-1 !ring-inset !ring-slate-200 focus:!bg-white focus:!ring-2 focus:!ring-secondary-500',
          },
        },
        size: {
          xl: {
            base: 'px-4 py-3 text-base',
          },
        },
      },
      defaultVariants: {
        variant: 'outline',
        size: 'xl',
      },
    },

    formField: {
      slots: {
        label: 'mb-2 block text-sm font-semibold text-primary-700',
        error: 'mt-2 text-sm text-secondary-600',
        help: 'mt-2 text-xs text-slate-400',
      },
    },

    toast: {
      slots: {
        root: 'rounded-xl border border-slate-200 bg-white shadow-lg',
        title: 'text-primary-700 font-semibold',
        description: 'text-slate-500',
        close: 'text-slate-400 hover:text-primary-700',
      },
    },
  },
});
