import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const query = new URL(request.url).searchParams.get('query');
  const res = await admin.rest.resources.Customer.search({
    session,
    query,
    limit: 250
  });
  return json(res)
};
