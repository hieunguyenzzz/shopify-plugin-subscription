import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Combobox,
  FormLayout,
  Icon,
  IndexTable,
  Layout,
  Listbox,
  Page,
  Select,
  Tabs,
  Text,
  TextField,
  useBreakpoints,
  useIndexResourceState
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef, useState } from "react";

const CustomerPicker = ({ onSelect }: { onSelect: (c: any) => void }) => {
  const cachedRef = useRef<{ [key: string]: any }>({}); // cache the data
  const [query, setQueryValue] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 300);
  let [res, setRes] = useState<any>(undefined);

  useEffect
    (() => {
      if (!debouncedQuery)
        return;
      let query = debouncedQuery
      if (cachedRef.current[query]) {
        return setRes(cachedRef.current[query]);
      }
      fetch('/customer?query=' + query).then((res) => {
        if (res.ok) {
          return res.json();
        }
      }).then((json) => {
        cachedRef.current[query] = json;
        setRes(json)
      });
    }, [debouncedQuery]);
  console.log({ res })
  return (
    <Combobox
      activator={
        <Combobox.TextField

          prefix={<Icon source={SearchMinor} />}
          value={query}
          onChange={setQueryValue}
          label="Search tags"
          labelHidden
          placeholder="type to search"
          autoComplete="off"
        />
      }
    >
      {res?.customers?.length && <Listbox onSelect={onSelect}>{
        res?.customers.map((customer: any, i: number) => {
          return <Listbox.Option key={customer.id} value={customer}>{customer.email}</Listbox.Option>
        })
      }</Listbox>}

    </Combobox>
  );
}
export default function AdditionalPage() {
  const [formstate, setFormState] = useState<{ [key: string]: any }>({});
  console.log({ formstate })
  return (
    <Page
      title="New Subcription"
      backAction={{
        url: '/app/subscriptions',
        content: 'Back',
      }}
    >
      <ui-title-bar title="The Subscriptions"></ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap={"200"}>
              <Text as="h4" variant="headingMd" fontWeight="bold">
                Subscription info
              </Text>
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    type="date"
                    label="Order date"
                    onChange={console.log}
                    autoComplete="off"

                  />
                  <TextField
                    type="time"
                    value="08:00"
                    label="Order time"
                    onChange={console.log}
                    autoComplete="off"
                  />

                </FormLayout.Group>
                <Text as="p" tone="subdued">
                  Write the date in YYYY-MM-DD format or click on the calendar icon to select it in the calendar.
                </Text>
                <FormLayout.Group>
                  <TextField disabled
                    type="number"
                    value="3"
                    label="Repeat every"
                    onChange={console.log}
                    autoComplete="off"
                    connectedRight={
                      <Select label=""
                        onChange={console.log}
                        value="month"
                        disabled
                        options={[
                          {
                            label: 'Day',
                            value: 'day',
                          },
                          {
                            label: 'Week',
                            value: 'week',
                          },
                          {
                            label: 'Month',
                            value: 'month',
                          },
                          {
                            label: 'Year',
                            value: 'year',
                          },
                        ]}
                      >
                      </Select>
                    }
                  />

                </FormLayout.Group>
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={"200"}>
              <Text as="h4" variant="headingMd" fontWeight="bold">
                Customer
              </Text>
              <FormLayout>
                <CustomerPicker onSelect={c => {
                  let shipping_address = c?.addresses?.[0]
                  let billing_address = c?.addresses?.[0]
                  setFormState({
                    ...formstate,
                    email: shipping_address?.email || c.email,
                    'shipping_address.first_name': shipping_address?.first_name,
                    'shipping_address.last_name': shipping_address?.last_name,
                    'shipping_address.address1': shipping_address?.address1,
                    'shipping_address.address2': shipping_address?.address2,
                    'shipping_address.city': shipping_address?.city,
                    'shipping_address.province': shipping_address?.province,
                    'shipping_address.country': shipping_address?.country,
                    'shipping_address.zip': shipping_address?.zip,
                    'shipping_address.phone': shipping_address?.phone,
                    'shipping_address.company': shipping_address?.company,

                    'billing_address.first_name': billing_address?.first_name,
                    'billing_address.last_name': billing_address?.last_name,
                    'billing_address.address1': billing_address?.address1,
                    'billing_address.address2': billing_address?.address2,
                    'billing_address.city': billing_address?.city,
                    'billing_address.province': billing_address?.province,
                    'billing_address.country': billing_address?.country,
                    'billing_address.zip': billing_address?.zip,
                    'billing_address.phone': billing_address?.phone,
                    'billing_address.company': billing_address?.company,
                  })
                }} />
              </FormLayout>
              <BlockStack gap={"400"}>
                <Box />
                <TextField type="email" label="Email" value={formstate?.email} onChange={console.log} autoComplete="off" />
                <Box />
                <Text as="h4" variant="bodyLg" fontWeight="bold">Shipping address</Text>
                <FormLayout.Group>
                  <TextField label="First name" value={formstate?.['shipping_address.first_name']} onChange={console.log} autoComplete="off" />
                  <TextField label="Last name" value={formstate?.['shipping_address.last_name']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Address" value={formstate?.['shipping_address.address1']} onChange={console.log} autoComplete="off" />
                  <TextField label="Address 2" value={formstate?.['shipping_address.address2']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Zip" value={formstate?.['shipping_address.zip']} onChange={console.log} autoComplete="off" />
                  <TextField label="City" value={formstate?.['shipping_address.city']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Province" value={formstate?.['shipping_address.province']} onChange={console.log} autoComplete="off" />
                  <TextField label="Country" value={formstate?.['shipping_address.country']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Phone" value={formstate?.['shipping_address.phone']} onChange={console.log} autoComplete="off" />
                  <TextField label="Company" value={formstate?.['shipping_address.company']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <Box />
                <Text as="h4" variant="bodyLg" fontWeight="bold">Billing address</Text>
                <FormLayout.Group>
                  <TextField label="First name" value={formstate?.['billing_address.first_name']} onChange={console.log} autoComplete="off" />
                  <TextField label="Last name" value={formstate?.['billing_address.last_name']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Address" value={formstate?.['billing_address.address1']} onChange={console.log} autoComplete="off" />
                  <TextField label="Address 2" value={formstate?.['billing_address.address2']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Zip" value={formstate?.['billing_address.zip']} onChange={console.log} autoComplete="off" />
                  <TextField label="City" value={formstate?.['billing_address.city']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Province" value={formstate?.['billing_address.province']} onChange={console.log} autoComplete="off" />
                  <TextField label="Country" value={formstate?.['billing_address.country']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField label="Phone" value={formstate?.['billing_address.phone']} onChange={console.log} autoComplete="off" />
                  <TextField label="Company" value={formstate?.['billing_address.company']} onChange={console.log} autoComplete="off" />
                </FormLayout.Group>
              </BlockStack>

            </BlockStack>
          </Card>

        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={"200"}>
              <Text as="h4" variant="headingMd" fontWeight="bold">
                Products
              </Text>
              <IndexTableWithMultiplePromotedBulkActions />
              <FormLayout>
                <Button variant="primary" onClick={async () => {
                  let p = await shopify.resourcePicker({
                    type: 'product',
                  })
                  console.log({ p })
                }} fullWidth>Add Product</Button>

              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page >
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
    <>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <IndexTableWithFiltering />
      </Tabs>
    </>
  );
}

function IndexTableWithMultiplePromotedBulkActions() {
  const orders = [
    {
      id: '1020',
      order: '#1020',
      date: 'Jul 20 at 4:34pm',
      customer: 'Jaydon Stanton',
      total: '$969.44',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1019',
      order: '#1019',
      date: 'Jul 20 at 3:46pm',
      customer: 'Ruben Westerfelt',
      total: '$701.19',
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1018',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
  ];
  const resourceName = {
    singular: 'order',
    plural: 'orders',
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

  const promotedBulkActions = [
    {
      content: 'Remove',
      onAction: () => console.log('Todo: implement bulk remove'),
    },

  ];

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={orders.length}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: 'Order' },
        { title: 'Date' },
        { title: 'Customer' },
        { title: 'Total', alignment: 'end' },
        { title: 'Payment status' },
        { title: 'Fulfillment status' },
      ]}
      promotedBulkActions={promotedBulkActions}
    >
      {rowMarkup}
    </IndexTable>
  );
}