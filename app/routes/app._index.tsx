import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Card,
  InlineStack,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import {
  DataSeries,
  LineChart,
  PolarisVizProvider,
} from "@shopify/polaris-viz";
import { ClientOnly } from "remix-utils/client-only";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    totalSubscriptions: 0,
    totalActiveSubscriptions: 0,
    totalActiveSubscriptionsRecent: [
      {
        value: 2,
        key: "12-09",
      },
      {
        value: 5,
        key: "12-10",
      },
      {
        value: 0,
        key: "12-11",
      },
      {
        value: 0,
        key: "12-12",
      },
      {
        value: 2,
        key: "12-13",
      },
      {
        value: 1,
        key: "12-14",
      },
      {
        value: 5,
        key: "12-15",
      },
    ],
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    },
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
};
export default function Index() {
  const {
    totalSubscriptions,
    totalActiveSubscriptions,
    totalActiveSubscriptionsRecent,
  } = useLoaderData<typeof loader>();
  return (
    <Page title="Overview">
      <ui-title-bar title="The Subcription"></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Layout>
              <Layout.Section variant="oneThird">
                <Card background="bg-surface-secondary">
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="medium">
                      Total subscriptions
                    </Text>
                    <Text variant="heading3xl" as="p">
                      {totalSubscriptions}
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>
              <Layout.Section variant="oneThird">
                <Card background="bg-surface-secondary">
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="medium">
                      Total active subscriptions
                    </Text>
                    <Text variant="heading3xl" as="p">
                      {totalActiveSubscriptions}
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card>
                  <BlockStack gap="500">
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        Total active subscriptions
                      </Text>
                      <Box padding="400" width="586px">
                        <RecentActivitychart
                          data={[
                            {
                              name: "Last 7 days",
                              data: totalActiveSubscriptionsRecent,
                            },
                          ]}
                        />
                      </Box>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Helps
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        How it work ?
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

const RecentActivitychart = ({ data }: { data: DataSeries[] }) => {
  return (
    <ClientOnly fallback={null}>
      {() => (
        <PolarisVizProvider>
          <div style={{ position: "relative" }}>
            <LineChart
              showLegend={false}
              tooltipOptions={{
                renderTooltipContent: (data) => {
                  return null;
                },
              }}
              theme="Light"
              data={data}
            ></LineChart>
          </div>
        </PolarisVizProvider>
      )}
    </ClientOnly>
  );
};
