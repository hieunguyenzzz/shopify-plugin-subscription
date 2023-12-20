import {
  BlockStack,
  Box,
  Button,
  Card,
  Combobox,
  FormLayout,
  Icon,
  IndexTable,
  InlineStack,
  Layout,
  Listbox,
  Page,
  Select,
  Text,
  TextField,
  useBreakpoints,
  useIndexResourceState
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

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
  const [lineItems, setlineItems] = useState<any[]>([])
  const variantsCacheRef = useRef<{ [key: string]: any }>({}); // cache the data
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
            <BlockStack gap={"600"}>
              <BlockStack gap="200">

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
              </BlockStack>

              <TextField type="email" label="Email" value={formstate?.email} onChange={console.log} autoComplete="off" />
              {/* <BlockStack gap={"400"}>
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
              </BlockStack>
              <BlockStack gap={"400"}>
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
              </BlockStack> */}

            </BlockStack>
          </Card>

        </Layout.Section>
        <Layout.Section>
          <Card padding={"0"}>
            <BlockStack>
              <Box padding={"400"} >
                <Text as="h4" variant="headingMd" fontWeight="bold">
                  Products
                </Text>
              </Box>
              <IndexTableWithMultiplePromotedBulkActions
                onRemove={(ids) => {
                  setlineItems((lineItems: any[]) => {
                    return lineItems.filter((lineItem) => !ids.includes(lineItem.id))
                  })
                }}
                lineItems={
                  lineItems
                }
                onUpdateLineItem={(id, quantity) => {
                  console.log({ id, quantity })
                  setlineItems((lineItems: any[]) => {
                    return lineItems.map((lineItem) => {
                      if (lineItem.id === id) {
                        return {
                          ...lineItem,
                          quantity
                        }
                      }
                      return lineItem
                    })
                  })
                }}
              />
              <Box padding={"400"} >
                <Button variant="primary" onClick={async () => {
                  let { selection } = await shopify.resourcePicker({
                    type: 'product',
                    action: 'select',
                  }) as any
                  console.log({ selection })
                  setlineItems((lineItems: any[]) => {
                    let arr = [...lineItems.map(line => line.id), ...selection.flatMap((p: any) => p.variants.map((v: any) => {
                      variantsCacheRef.current[v.id] = v
                      variantsCacheRef.current[v.id].product = p
                      return v.id
                    }))]
                    return Object.values(arr.reduce((acc: {}, id: string) => {
                      let v = variantsCacheRef.current[id]
                      if (!v) return acc
                      if (!acc[id]) {
                        acc[id] = {
                          id,
                          variant: v,
                          quantity: 1
                        }
                      } else {
                        acc[id].quantity++
                      }
                      return acc
                    }, {}))
                  })
                }} fullWidth>Add Product</Button>

              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section >
          <InlineStack align="end">
            <Button variant="primary" size="large">Create subscription</Button>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <Box padding={"1000"} />
        </Layout.Section>

      </Layout>
    </Page >
  );
}
let formatNumber = (n: number) => {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'GBP' })
}

function IndexTableWithMultiplePromotedBulkActions({ lineItems, onRemove, onUpdateLineItem }: {
  onRemove: (ids: string[]) => void,
  onUpdateLineItem: (id: string, quantity: number) => void,
  lineItems: {
    variant: {
      id: string,
      displayName: string,
      price: string,
    }
    quantity: number,

  }[]
}) {
  console.log("==>", lineItems)

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(lineItems);
  const rowMarkup = lineItems.map(
    (
      { quantity, variant: { displayName, price, id } },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {displayName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{formatNumber(Number(price))}</IndexTable.Cell>
        <IndexTable.Cell  >
          <div onClick={e => {
            e.stopPropagation()
          }}>
            <TextField
              label=""
              type="number"
              min={1}
              step={1}
              value={'' + (quantity)}
              onChange={(value) => { onUpdateLineItem(id, Number(value)) }}
              autoComplete="off"
            />
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {formatNumber(Number(price) * quantity)}
          </Text>
        </IndexTable.Cell>

      </IndexTable.Row >
    ),
  );

  const promotedBulkActions = [
    {
      content: 'Remove',
      onAction: () => onRemove(selectedResources),
    },

  ];

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={lineItems.length}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: 'Name' },
        { title: 'Price' },
        { title: 'Quantity' },
        { title: 'Total Price', alignment: 'end' },
      ]}
      promotedBulkActions={promotedBulkActions}
    >
      {rowMarkup}
    </IndexTable>
  );
}