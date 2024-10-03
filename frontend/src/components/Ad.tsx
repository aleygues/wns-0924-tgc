import { Link } from "react-router-dom";
import { AdType } from "../types";

export function Ad(
  props: AdType & {
    onAddToCart?: () => void;
  }
) {
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" to={`/ads/${props.id}`}>
        <img className="ad-card-image" src={props.picture} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">
            {(props.price / 100).toFixed(2)} €
          </div>
          {props.tags.map((tag) => (
            <p>{tag.name}</p>
          ))}
        </div>
      </Link>
      {props.onAddToCart && (
        <button className="button" onClick={props.onAddToCart}>
          Ajouter au panier
        </button>
      )}
    </div>
  );
}
