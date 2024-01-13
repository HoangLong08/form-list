import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  CloseOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";
import debounce from "lodash/debounce";

interface Props {
  formRef: any;
}

const PropertiesProduct = ({ formRef }: Props) => {
  const [propertiesState, setPropertiesState] = useState<any>([]);

  const filterOptionFabric = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleDebouncedChange = useCallback(
    debounce((selectedValues: any) => {
      setPropertiesState(selectedValues);
    }, 3000), // Thời gian debounce là 300ms
    []
  );

  const handleChange = (selectedValues: any) => {
    // Gọi hàm debounce khi sự kiện onChange xảy ra
    handleDebouncedChange(selectedValues);
  };

  return (
    <Form.List name="properties">
      {/* Main đặc tính sản phẩm */}
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={uuidv4()}>
              <Space
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
                wrap
              >
                {/* nút collapse */}
                <Form.Item label=" ">
                  <Button type="link" icon={<PlusOutlined />} />
                </Form.Item>
                {/* nhập vải */}
                <Form.Item {...restField} name={[name, "fabric"]} label="Vải">
                  <Select
                    style={{ width: "200px" }}
                    showSearch
                    options={[
                      {
                        id: "1-code",
                        code: "1-code",
                        type: "SPECIAL",
                      },
                      {
                        id: "2-code",
                        code: "2-code",
                        type: "NORMAL",
                      },
                    ].map((item) => ({
                      value: item.id,
                      // label: `${item.name.vi}/${item.name.en}/${item.type}`,
                      label: `${item.code}`,
                      title: `${item.code}/${item.type}`,
                    }))}
                    filterOption={filterOptionFabric}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    optionRender={(option: any) => (
                      <p
                        style={{
                          color:
                            option.data.title?.split("/")?.[1] === "SPECIAL"
                              ? "red"
                              : "",
                        }}
                      >
                        {option.label?.split("/")?.[0]}
                      </p>
                    )}
                    onChange={() => {
                      const mainProperties = formRef.getFieldValue([
                        "properties",
                      ]);

                      const res = mainProperties.map(
                        (item: any, index: number) => {
                          if (index === name) {
                            return {
                              ...item,
                              propertiesSub: formRef
                                .getFieldValue(["properties"])
                                [name]?.size?.map((_: any, indexSub: any) => {
                                  return {
                                    fabricSub: formRef.getFieldValue([
                                      "properties",
                                    ])?.[name]?.fabric,
                                    sizeSub: formRef.getFieldValue([
                                      "properties",
                                    ])[name]?.size?.[indexSub],
                                    amountViSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountVi || "",
                                    amountEnSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountEn || "",
                                  };
                                }),
                            };
                          }
                          return item;
                        }
                      );
                      setPropertiesState(res);
                      // handleChange(res);
                    }}
                  />
                </Form.Item>

                {/* nhập size */}
                <Form.Item
                  {...restField}
                  name={[name, "size"]}
                  label="Size"
                  rules={[
                    { required: true, message: "Nhập size của sản phẩm" },
                    {
                      validator: async () => {
                        const properties = formRef.getFieldValue([
                          "properties",
                        ]);
                        const hasDuplicates = !isEqual(
                          properties.length,
                          uniqWith(properties, (obj1, obj2) =>
                            isEqual(
                              pick(obj1, ["size", "fabric"]),
                              pick(obj2, ["size", "fabric"])
                            )
                          ).length
                        );
                        if (hasDuplicates) {
                          throw new Error("Bạn đã chọn size và vải trùng nhau");
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    style={{ width: "250px" }}
                    options={[
                      {
                        id: "1-size",
                        name: "1-size",
                      },
                      {
                        id: "2-size",
                        name: "2-size",
                      },
                    ].map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onChange={() => {
                      // console.log('key, name: ', key, name);
                      console.log("1: ", formRef.getFieldValue(["properties"]));

                      const mainProperties = formRef.getFieldValue([
                        "properties",
                      ]);

                      const res = mainProperties.map(
                        (item: any, index: number) => {
                          if (index === name) {
                            return {
                              ...item,
                              propertiesSub: formRef
                                .getFieldValue(["properties"])
                                [name]?.size?.map((_: any, indexSub: any) => {
                                  console.log(
                                    "2: ",
                                    formRef.getFieldValue(["properties"])?.[
                                      name
                                    ]
                                  );
                                  return {
                                    fabricSub: formRef.getFieldValue([
                                      "properties",
                                    ])?.[name]?.fabric,
                                    sizeSub: formRef.getFieldValue([
                                      "properties",
                                    ])[name]?.size?.[indexSub],
                                    amountViSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountVi || "",
                                    amountEnSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountEn || "",
                                  };
                                }),
                            };
                          }
                          return item;
                        }
                      );
                      // handleChange(res);
                      setPropertiesState(res);
                      // console.log('res: ', formRef.getFieldValue(['properties'])[key]?.size);
                    }}
                    maxTagCount="responsive"
                  />
                </Form.Item>

                {/* nhập giá tiền (VNĐ) */}
                <Form.Item
                  {...restField}
                  name={[name, "amountVi"]}
                  label="Giá tiền (VNĐ) (Main)"
                >
                  <InputNumber
                    formatter={(value) =>
                      `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    controls={false}
                    style={{ width: "130px" }}
                    onKeyDown={(e) => {
                      const isControlPressed = e.ctrlKey || e.metaKey; // Cho phép cả Ctrl và Command trên MacOS

                      const isAllowedKey =
                        /^\d$|^Backspace$|^\.$|^Tab$|^Arrow(Up|Down|Left|Right)$/.test(
                          e.key
                        ) ||
                        (isControlPressed &&
                          /^[cva x]$/.test(e.key.toLowerCase()));

                      if (!isAllowedKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const mainProperties = formRef.getFieldValue([
                        "properties",
                      ]);

                      const res = mainProperties.map(
                        (item: any, index: number) => {
                          if (index === name) {
                            return {
                              ...item,
                              propertiesSub: formRef
                                .getFieldValue(["properties"])
                                [name]?.size?.map((_: any, indexSub: any) => {
                                  console.log(
                                    "2: ",
                                    formRef.getFieldValue(["properties"])?.[
                                      name
                                    ]
                                  );
                                  return {
                                    fabricSub: formRef.getFieldValue([
                                      "properties",
                                    ])?.[name]?.fabric,
                                    sizeSub: formRef.getFieldValue([
                                      "properties",
                                    ])[name]?.size?.[indexSub],
                                    amountViSub: e || "",
                                    amountEnSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountEn || "",
                                  };
                                }),
                            };
                          }
                          return item;
                        }
                      );
                      setPropertiesState(res);
                    }}
                  />
                </Form.Item>
                {/* nhập giá tiền (USD) */}
                <Form.Item
                  {...restField}
                  name={[name, "amountEn"]}
                  label="Giá tiền (USD) (Main)"
                >
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    controls={false}
                    style={{ width: "130px" }}
                    onKeyDown={(e) => {
                      const isControlPressed = e.ctrlKey || e.metaKey; // Cho phép cả Ctrl và Command trên MacOS

                      const isAllowedKey =
                        /^\d$|^Backspace$|^\.$|^Tab$|^Arrow(Up|Down|Left|Right)$/.test(
                          e.key
                        ) ||
                        (isControlPressed &&
                          /^[cva x]$/.test(e.key.toLowerCase()));

                      if (!isAllowedKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={() => {
                      const mainProperties = formRef.getFieldValue([
                        "properties",
                      ]);

                      const res = mainProperties.map(
                        (item: any, index: number) => {
                          if (index === name) {
                            return {
                              ...item,
                              propertiesSub: formRef
                                .getFieldValue(["properties"])
                                [name]?.size?.map((_: any, indexSub: any) => {
                                  console.log(
                                    "2: ",
                                    formRef.getFieldValue(["properties"])?.[
                                      name
                                    ]
                                  );
                                  return {
                                    fabricSub: formRef.getFieldValue([
                                      "properties",
                                    ])?.[name]?.fabric,
                                    sizeSub: formRef.getFieldValue([
                                      "properties",
                                    ])[name]?.size?.[indexSub],
                                    amountViSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountVi || "",
                                    amountEnSub:
                                      formRef.getFieldValue(["properties"])?.[
                                        name
                                      ]?.amountEn || "",
                                  };
                                }),
                            };
                          }
                          return item;
                        }
                      );
                      setPropertiesState(res);
                    }}
                  />
                </Form.Item>

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px" }}>Giá liên hệ</p>
                  <Checkbox />
                </div>
                {/* action main  */}
                {/* nút cập nhật action main */}
                <Form.Item label=" ">
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      console.log("propertiesState: ", propertiesState);
                      // khi nhấn nút cập nhật thì mới set

                      formRef.setFieldsValue({
                        properties: propertiesState,
                      });
                    }}
                    icon={<ReloadOutlined className="dynamic-delete-button" />}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
                {fields.length > 1 ? (
                  <Space>
                    <Form.Item label=" ">
                      <Button
                        type="primary"
                        size="middle"
                        danger
                        onClick={() => {
                          console.log(
                            "formRef.getFieldValue(['properties']);: ",
                            formRef.getFieldValue(["properties"])
                          );
                          // const newArr = listInfoDetailProduct?.filter(
                          //   (item) => item?.id !== listInfoDetailProduct?.[key]?.id
                          // ) || [{ id: uuidv4(), isQuoteLater: false }];
                          // setListInfoDetailProduct(newArr);
                          remove(name);
                        }}
                        icon={
                          <CloseOutlined className="dynamic-delete-button" />
                        }
                      />
                    </Form.Item>
                  </Space>
                ) : null}
              </Space>

              {/* sub đặc tính sản phẩm */}
              <div style={{ marginLeft: "80px", marginBottom: "24px" }}>
                <Form.List name={[name, "propertiesSub"]}>
                  {(subFields, subOpt) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 16,
                      }}
                      key={uuidv4()}
                    >
                      {subFields.map((subField) => (
                        <Space key={uuidv4()}>
                          {/* sub nhập vải */}
                          <Form.Item
                            name={[subField.name, "fabricSub"]}
                            label="Vải"
                          >
                            <Select
                              style={{ width: "200px" }}
                              showSearch
                              options={[
                                {
                                  id: "1-code",
                                  code: "1-code",
                                  type: "SPECIAL",
                                },
                                {
                                  id: "2-code",
                                  code: "2-code",
                                  type: "NORMAL",
                                },
                              ].map((item) => ({
                                value: item.id,
                                // label: `${item.name.vi}/${item.name.en}/${item.type}`,
                                label: `${item.code}`,
                                title: `${item.code}/${item.type}`,
                              }))}
                              filterOption={filterOptionFabric}
                              onChange={() => {
                                console.log(
                                  formRef.getFieldValue(["properties"])[key]
                                );
                              }}
                              // eslint-disable-next-line react/no-unstable-nested-components
                              optionRender={(option: any) => (
                                <p
                                  style={{
                                    color:
                                      option.data.title?.split("/")?.[1] ===
                                      "SPECIAL"
                                        ? "red"
                                        : "",
                                  }}
                                >
                                  {option.label?.split("/")?.[0]}
                                </p>
                              )}
                            />
                          </Form.Item>

                          {/* sub nhập size */}
                          <Form.Item
                            name={[subField.name, "sizeSub"]}
                            label="Size"
                          >
                            <Select
                              style={{ width: "100px" }}
                              options={[
                                {
                                  id: "1-size",
                                  name: "1-size",
                                },
                                {
                                  id: "2-size",
                                  name: "2-size",
                                },
                              ].map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              onChange={() => {
                                console.log(formRef.getFieldValue());
                                // formRef.setFieldsValue({

                                // })
                              }}
                            />
                          </Form.Item>

                          {/* sub nhập giá tiền (VNĐ) */}
                          <Form.Item
                            name={[subField.name, "amountViSub"]}
                            label="Giá tiền (VNĐ)"
                          >
                            <InputNumber
                              formatter={(value) =>
                                `đ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              }
                              controls={false}
                              style={{ width: "130px" }}
                              onKeyDown={(e) => {
                                const isControlPressed = e.ctrlKey || e.metaKey; // Cho phép cả Ctrl và Command trên MacOS

                                const isAllowedKey =
                                  /^\d$|^Backspace$|^\.$|^Tab$|^Arrow(Up|Down|Left|Right)$/.test(
                                    e.key
                                  ) ||
                                  (isControlPressed &&
                                    /^[cva x]$/.test(e.key.toLowerCase()));

                                if (!isAllowedKey) {
                                  e.preventDefault();
                                }
                              }}
                              // disabled={
                              //   listFabricsByAdmin.data?.find(
                              //     (item) => listPropertiesOfFormState?.[key]?.fabric === item.id
                              //   )?.type === 'SPECIAL' || listInfoDetailProduct?.[key]?.isQuoteLater
                              // }
                            />
                          </Form.Item>

                          {/* sub nhập giá tiền (USD) */}
                          <Form.Item
                            name={[subField.name, "amountEnSub"]}
                            label="Giá tiền (USD)"
                          >
                            <InputNumber
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              }
                              controls={false}
                              style={{ width: "130px" }}
                              onKeyDown={(e) => {
                                const isControlPressed = e.ctrlKey || e.metaKey; // Cho phép cả Ctrl và Command trên MacOS

                                const isAllowedKey =
                                  /^\d$|^Backspace$|^\.$|^Tab$|^Arrow(Up|Down|Left|Right)$/.test(
                                    e.key
                                  ) ||
                                  (isControlPressed &&
                                    /^[cva x]$/.test(e.key.toLowerCase()));

                                if (!isAllowedKey) {
                                  e.preventDefault();
                                }
                              }}
                              // disabled={
                              //   listFabricsByAdmin.data?.find(
                              //     (item) => listPropertiesOfFormState?.[key]?.fabric === item.id
                              //   )?.type === 'SPECIAL' || listInfoDetailProduct?.[key]?.isQuoteLater
                              // }
                            />
                          </Form.Item>

                          <div
                            style={{
                              textAlign: "center",
                              marginBottom: "36px",
                            }}
                          >
                            <p style={{ fontSize: "10px" }}>Giá liên hệ</p>
                            <Checkbox
                            // value={listInfoDetailProduct?.[key]}
                            // checked={listInfoDetailProduct?.[key]?.isQuoteLater}
                            // onChange={(e) => {
                            //   const newArr = listInfoDetailProduct.map((item) => {
                            //     if (item?.id === e.target.value?.id) {
                            //       return {
                            //         ...item,
                            //         isQuoteLater: !item?.isQuoteLater,
                            //       };
                            //     }
                            //     return item;
                            //   });
                            //   setListInfoDetailProduct(newArr);
                            // }}
                            // disabled={
                            //   listFabricsByAdmin.data?.find(
                            //     (item) => formRef.getFieldsValue()?.properties?.[key]?.fabric === item.id
                            //   )?.type === 'SPECIAL'
                            // }
                            />
                          </div>
                          <Button
                            type="primary"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => {
                              subOpt.remove(subField.name);
                            }}
                          ></Button>
                        </Space>
                      ))}
                      {/* <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Add Sub Item
                      </Button> */}
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
          ))}
          <Form.Item>
            <Button
              type="primary"
              ghost
              size="large"
              onClick={() => {
                // const newArr = [...listInfoDetailProduct, { id: uuidv4(), isQuoteLater: false }];
                // setListInfoDetailProduct(newArr);
                add();
              }}
              icon={<PlusOutlined />}
            >
              Thêm chi tiết sản phẩm (vải, size, giá, giảm giá)
            </Button>

            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default PropertiesProduct;
