import {
  type LoaderFunctionArgs
} from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  Link,
  Page,
  Text
} from "@shopify/polaris";
import {
  DataSeries,
  LineChart,
  PolarisVizProvider,
} from "@shopify/polaris-viz";
import { ClientOnly } from "remix-utils/client-only";
import { authenticate } from "../shopify.server";
async function getTotalSubscription() {
  return 0;
}
async function getTotalActiveSubscription() {
  return 0;
}
async function getTotalActiveSubscriptionRecent() {
  return [
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
  ];
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    totalSubscriptions: await getTotalSubscription(),
    totalActiveSubscriptions: await getTotalActiveSubscription(),
    totalActiveSubscriptionsRecent: await getTotalActiveSubscriptionRecent(),
  };
};


export default function Index() {
  const {
    totalSubscriptions,
    totalActiveSubscriptions,
    totalActiveSubscriptionsRecent,
  } = useLoaderData<typeof loader>();
  return (
    <Page title="Overview">
      <ui-title-bar title="The Subscriptions"></ui-title-bar>

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
                      <Box padding="400" width="586px" minHeight="600">
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
              <Layout.Section>
                <Card >
                  <Text as="h3" fontWeight="bold">
                    Subsctiptions
                  </Text>
                  <Box padding={"100"} />
                  <p>View a summary of your Subsctiptions.</p>
                  <Box padding={"100"} />
                  <Button fullWidth url="/app/subscriptions">Details</Button>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card >
                  <Text as="h3" fontWeight="bold">
                    Subsctiption Rules
                  </Text>
                  <Box padding={"100"} />
                  <p>View a summary of your online Subsctiption rules.</p>
                  <Box padding={"100"} />
                  <Button fullWidth url="/app/subscription-rules">Details</Button>
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
      </BlockStack >
    </Page >
  );
}

const RecentActivitychart = ({ data }: { data: DataSeries[] }) => {
  return (
    <ClientOnly fallback={null}>
      {() => (
        <PolarisVizProvider>
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
        </PolarisVizProvider>
      )}
    </ClientOnly>
  );
};
