import { Link } from "react-router-dom";

export type AdProps = {
  title: string;
  price: number;
  picture: string;
  id: number;
};

export function Ad(
  props: AdProps & {
    onAddToCart: () => void;
  }
) {
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" to={`/ads/${props.id}`}>
        <img className="ad-card-image" src={props.picture} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </Link>
      <button className="button" onClick={props.onAddToCart}>
        Ajouter au panier
      </button>
    </div>
  );
}
