declare module 'tailwindcss/colors' {
  const colors: {
    [key: string]: {
      [shade: string]: string;
    };
  };
  export default colors;
}

declare module 'tailwindcss/defaultTheme' {
  const defaultTheme: {
    [key: string]: any;
  };
  export default defaultTheme;
}

// Utilitários do Tailwind como tipos
type TailwindColor = string | { [key: string]: string };
type TailwindConfig = { [key: string]: any };

export { TailwindColor, TailwindConfig };
