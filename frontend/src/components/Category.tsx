import { Link } from "react-router-dom";
import { CategoryType } from "../types";

export function Category(props: CategoryType) {
  return (
    <Link to={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </Link>
  );
}
