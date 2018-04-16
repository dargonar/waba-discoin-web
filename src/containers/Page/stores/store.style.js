import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '../../../config/withDirection';

const StoreCardWrapper = styled.div`
    background-color: #fff;
    margin: 0 0 20px 0;
    padding: 10px 10px 0 10px;
    border-radius: 5px;
    
    ul {
        list-style: none;
        padding-left: 10px;
    }

    li:before {
        content: "+";
        margin-right: 4px;
    }

    .rightButtons {
        button {
            margin-left: 5px;
        }
    }
`

export default WithDirection(StoreCardWrapper);
