import {
  Navigate
} from "react-router-dom";

type Props = {

  children: React.ReactNode;

  allowedRoles: string[];
};

const ProtectedRoute = ({
  children,
  allowedRoles
}: Props) => {

  const user =
    JSON.parse(

      localStorage.getItem(
        "user"
      ) || "null"
    );

  if (!user) {

    return (
      <Navigate to="/login" />
    );
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate to="/" />
    );
  }

  return children;
};

export default ProtectedRoute;