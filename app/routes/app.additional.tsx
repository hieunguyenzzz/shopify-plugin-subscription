import {
  BlockStack,
  Box,
  Card,
  Layout,
  LegacyCard,
  Link,
  List,
  Page,
  Tabs,
  Text,
} from "@shopify/polaris";
import { useCallback, useState } from "react";

export default function AdditionalPage() {
  return (
    <Page>
      <ui-title-bar title="Additional page">
        <button variant="primary">Add subscription</button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <LegacyCard>
            <Content />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Content() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    [
      {
        id: "upcomingSubscriptions",
        content: "Upcoming subscriptions content",
        accessibilityLabel: "Upcoming subscriptions",
        panelID: "upcomingSubscriptions-panel",
      },
      {
        id: "withFailedPayment",
        content: "With failed payment content",
        accessibilityLabel: "With failed payment",
        panelID: "withFailedPayment-panel",
      },
      {
        id: "withPendingPayment",
        content: "With pending payment content",
        accessibilityLabel: "With pending payment",
        panelID: "withPendingPayment-panel",
      },
      {
        id: "paused",
        content: "Paused content",
        accessibilityLabel: "Paused",
        panelID: "paused-panel",
      },
      {
        id: "cancelled",
        content: "Cancelled content",
        accessibilityLabel: "Cancelled",
        panelID: "cancelled-panel",
      },
    ],
  ];

  return (
    <>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Box padding="400">
          <p>Tab {selected} selected</p>
        </Box>
      </Tabs>
    </>
  );
}
function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
