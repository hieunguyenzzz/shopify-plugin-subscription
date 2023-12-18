import {
  Badge,
  BlockStack,
  Card,
  IndexTable,
  Layout,
  Page,
  Tabs,
  Text,
  useBreakpoints,
  useIndexResourceState
} from "@shopify/polaris";
import { useCallback, useState } from "react";

export default function AdditionalPage() {
  return (
    <Page
      title="Subcriptions"
      secondaryActions={[{ content: "Add subscription", url: '/app/subscriptions/add' }]}
    >
      <ui-title-bar title="The Subscriptions"></ui-title-bar>
      <Layout>
        <Layout.Section>
          <Content />
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
    {
      id: "Upcoming subscriptions",
      content: "Upcoming subscriptions",
      accessibilityLabel: "Upcoming subscriptions",
      panelID: "Upcoming subscriptions",
    },
    {
      id: "With failed payment",
      content: "With failed payment",
      accessibilityLabel: "With failed payment",
      panelID: "With failed payment",
    },
    {
      id: "With pending payment",
      content: "With pending payment",
      accessibilityLabel: "With pending payment",
      panelID: "With pending payment",
    },
    {
      id: "Paused",
      content: "Paused",
      accessibilityLabel: "Paused",
      panelID: "Paused",
    },
    {
      id: "Cancelled",
      content: "Cancelled content",
      accessibilityLabel: "Cancelled",
      panelID: "Cancelled",
    },
  ];

  return (
    <Card padding={"0"}>
      <BlockStack gap={'400'}>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <IndexTableWithFiltering />
        </Tabs>

      </BlockStack>
    </Card>
  );
}

function IndexTableWithFiltering() {
  const orders = [
    {
      id: "1020",
      order: "#1020",
      date: "Jul 20 at 4:34pm",
      customer: "Jaydon Stanton",
      total: "$969.44",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1019",
      order: "#1019",
      date: "Jul 20 at 3:46pm",
      customer: "Ruben Westerfelt",
      total: "$701.19",
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1018",
      order: "#1018",
      date: "Jul 20 at 3.44pm",
      customer: "Leo Carder",
      total: "$798.24",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={orders.length}
      selectedItemsCount={
        allResourcesSelected ? "All" : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: "Order" },
        { title: "Date" },
        { title: "Customer" },
        { title: "Total", alignment: "end" },
        { title: "Payment status" },
        { title: "Fulfillment status" },
      ]}
    >
      {rowMarkup}
    </IndexTable>
  );

}
