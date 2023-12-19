import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  BlockStack,
  Card,
  Frame,
  IndexTable,
  Layout,
  Loading,
  Page,
  TabProps,
  Tabs,
  Text,
  useBreakpoints
} from "@shopify/polaris";
import { useCallback, useState } from "react";
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await sleep(500)
  return json({
    subscriptions: [
      {
        id: "1020",
        "order": "#1020",
        date: "Jul 20 at 4:34pm",
        customer: "Jaydon Stanton",
        total: "$969.44",
      },
      {
        id: "1019",
        order: "#1019",
        date: "Jul 20 at 3:46pm",
        customer: "Ruben Westerfelt",
        total: "$701.19",
      },
      {
        id: "1018",
        order: "#1018",
        date: "Jul 20 at 3.44pm",
        customer: "Leo Carder",
        total: "$798.24",
      },
    ]
  });
};
export default function AdditionalPage() {
  return (
    <Page
      title="Subcriptions"
      secondaryActions={[{ content: "Add subscription", url: '/app/subscriptions/add' }]}
      backAction={{
        url: '/app',
        content: 'Back',
      }}
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
  const [searchParams] = useSearchParams()
  let filter = searchParams.get('filter')
  console.log({ filter, selected })
  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs: TabProps[] = [
    {
      id: "Upcoming subscriptions",
      content: "Upcoming subscriptions",
      accessibilityLabel: "Upcoming subscriptions",
      panelID: "Upcoming subscriptions",
      url: '/app/subscriptions?filter=upcoming'
    },
    {
      id: "With failed payment",
      content: "With failed payment",
      accessibilityLabel: "With failed payment",
      panelID: "With failed payment",
      url: '/app/subscriptions?filter=failed'
    },
    {
      id: "With pending payment",
      content: "With pending payment",
      accessibilityLabel: "With pending payment",
      panelID: "With pending payment",
      url: '/app/subscriptions?filter=pending'
    },
    {
      id: "Paused",
      content: "Paused",
      accessibilityLabel: "Paused",
      panelID: "Paused",
      url: '/app/subscriptions?filter=paused'
    },
    {
      id: "Cancelled",
      content: "Cancelled content",
      accessibilityLabel: "Cancelled",
      panelID: "Cancelled",
      url: '/app/subscriptions?filter=cancelled'
    },
  ];
  const { subscriptions } = useLoaderData<typeof loader>()
  const loading = filter && !tabs[selected].url?.includes(filter + '')
  return (
    <Frame>
      {loading && <Loading />}
      <Card padding={"0"} >
        <BlockStack gap={'400'}>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} >
            <IndexTableWithFiltering subscriptions={subscriptions} />
          </Tabs>
        </BlockStack>
      </Card>
    </Frame>

  );
}

function IndexTableWithFiltering({ subscriptions }: { subscriptions: any[] }) {


  const resourceName = {
    singular: "order",
    plural: "orders",
  };



  const rowMarkup = subscriptions.map(
    (
      { id, order, date, customer, total },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>{ }</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>

      </IndexTable.Row>
    ),
  );

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={subscriptions.length}
      selectable={false}
      headings={[
        { title: "Order" },
        { title: "Date" },
        { title: "Customer" },
        { title: "Email", },
        { title: "Total", alignment: "end" },
      ]}
    >
      {rowMarkup}
    </IndexTable>
  );

}
