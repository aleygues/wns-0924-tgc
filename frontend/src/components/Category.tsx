import { Link } from "react-router-dom";

export type CategoryProps = {
  name: string;
  id: number;
};

export function Category(props: CategoryProps) {
  return (
    <Link to={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </Link>
  );
}
