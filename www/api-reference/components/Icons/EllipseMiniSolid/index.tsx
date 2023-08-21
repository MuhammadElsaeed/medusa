import type IconProps from "../types"

const IconEllipseSolid = ({
  iconColorClassName,
  containerClassName,
  ...props
}: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={containerClassName}
      {...props}
    >
      <circle
        cx="10"
        cy="10"
        r="2"
        className={
          iconColorClassName ||
          "fill-medusa-fg-subtle dark:fill-medusa-fg-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconEllipseSolid
