import styled from 'styled-components';

const LayoutContentWrapper = styled.div`
  padding: 30px 20px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;
  align-items: top;
  @media only screen and (max-width: 767px) {
    padding: 50px 20px;
  }

  @media (max-width: 580px) {
    padding: 15px;
  }
`;

export { LayoutContentWrapper };
