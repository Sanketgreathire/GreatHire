import {Helmet} from "react-helmet-async";

const NoIndex = () => {
    return(
        <Helmet>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
    );
};

export default NoIndex;