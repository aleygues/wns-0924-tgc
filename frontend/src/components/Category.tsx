import { Link } from "react-router-dom";
import { Category as CategoryType } from "../gql/graphql";

export function Category(props: Partial<CategoryType>) {
  return (
    <Link to={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </Link>
  );
}
