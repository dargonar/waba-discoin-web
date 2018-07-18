import styled from "styled-components";

const CategoryTableWrapper = styled.div`
  width: 100%;
  ul {
    width: 100%;
    margin: 0px;
    padding: 0px;
    list-style-type: none;
  }
  li {
    display: block;
    span {
      cursor: pointer;
      margin: 4px 0;
      padding: 10px;
      item-margin: 4px 0;
      background: #fff;
      border-radius: 3px;
      display: block;
      width: 100%;
      color: #333;
    }
    span:hover {
      box-shadow: 1px 1px 1px #ccc;
      color: #000;
    }
  }

  ul > li > span {
    font-weight: bold;
  }
  ul > li > ul > li > span {
    background: #f7f7f7;
    padding-left: 40px;
    font-weight: normal;
  }
  li.category {
    margin-bottom: 30px;
  }
  .pull-right {
    float: right;
  }
`;

export default CategoryTableWrapper;
