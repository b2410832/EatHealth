import { BrowserRouter as Router, Switch, Route, useRouteMatch, useHistory, NavLink, useParams } from "react-router-dom";

import RecipeList from "../RecipeList/RecipeList";
import FollowList from "../FollowList/FollowList";

const SubProfile = ({ followings, user }) => {
    let { subProfile } = useParams();
    return (
        <div>
            {
                subProfile !== "followings"  
                ? <RecipeList subProfile={subProfile}/>
                : <FollowList followings={followings} user={user}/>
            }
        </div>
    )
}

export default SubProfile;