import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation";

// export async function loader() {
//   const contacts = await getContacts();
//   return { contacts };
// }

export default function Root() {
  // const { contacts } = useLoaderData();
  return (
    <div className="root-container">
      <Navigation></Navigation>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
}
