import { Link } from "react-router-dom";

export default function ScrollLink({ to, children, ...rest }) {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Link to={to} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
