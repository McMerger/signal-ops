import "framer-motion";

declare module "framer-motion" {
    interface MotionProps {
        className?: string;
        onClick?: React.MouseEventHandler<Element>;
        onMouseEnter?: React.MouseEventHandler<Element>;
        onMouseLeave?: React.MouseEventHandler<Element>;
        disabled?: boolean;
        type?: string;
        href?: string;
        target?: string;
        rel?: string;
    }
}
