export default function Button({ children, textOnly, className, ...props }) {
  let cssClasses = textOnly ? 'text-button' : 'button';
  cssClasses += ' ' + className;

  // console.log("className", className);
  // console.log("cssClasses", cssClasses);
  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}
