import styled from "styled-components";

const AdsContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;

  & > * {
    width: 30%;
    min-width: 300px;
  }
`;

export default AdsContainer;
