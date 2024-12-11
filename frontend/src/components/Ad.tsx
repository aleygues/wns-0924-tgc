import { Link } from "react-router-dom";
import styled from "styled-components";
import { AdsQuery, Ad as AdType } from "../gql/graphql";
import { DeepPartial } from "@apollo/client/utilities";

const Card = styled(Link)<{ $important?: boolean }>`
  border: 1px solid
    ${(props) => (props.$important === true ? "#ac9022" : "#afafaf")};
  border-radius: 16px;
  display: block;
  color: black;
  text-decoration: none;
  overflow: hidden;

  & > div {
    padding: 16px;

    h4 {
      margin: 0px;
      font-weight: 500;
      font-size: 1em;
    }

    p {
      margin: 0px;
      font-size: 1em;
      color: #4d4d4d;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Tags = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;

  span {
    display: block;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: #d5f2af;
    font-size: 0.8em;
  }
`;

export function Ad(
  props: DeepPartial<AdType> & {
    onAddToCart?: () => void;
    important?: boolean;
  }
) {
  return (
    <Card to={`/ads/${props.id}`} $important={props.important}>
      <Image src={props.picture} />
      <div>
        <h4>{props.title}</h4>
        <p>{((props.price ?? 0) / 100).toFixed(2)} €</p>
        <Tags>
          {props.tags?.map((tag) => (
            <span>{tag?.name}</span>
          ))}
        </Tags>
      </div>
      {/*   {props.onAddToCart && (
        <button className="button" onClick={props.onAddToCart}>
          Ajouter au panier
        </button>
      )} */}
    </Card>
  );
}
