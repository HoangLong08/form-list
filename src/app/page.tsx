"use client";

import Image from "next/image";
import "./page.css";
import { Form } from "antd";
import PropertiesProduct from "./PropertiesProduct";

export default function Home() {
  const [formRef] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("values: ", values);
  };

  return (
    <main>
      <Form
        name="form-product"
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        layout="vertical"
        form={formRef}
        onFinish={onFinish}
        initialValues={{ properties: [{}], listCatalogs: [] }}
        autoComplete="off"
      >
        <PropertiesProduct formRef={formRef} />
      </Form>
    </main>
  );
}
