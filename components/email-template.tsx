// import React from "react";
import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { IUser } from "@/lib/database/models/user.model";
import { formatDate } from "@/lib/utils";
import Logo from "@/public/assets/images/logo.png";

export interface EmailTemplateProps {
  values: {
    cstName: string;
    location?: string;
    mobile: string;
    email: string;
    from: Date;
    to: Date;
    numberOfHours: string;
    numberOfKids: string;
    ageOfKidsFrom: string;
    ageOfKidsTo: string;
    extraInfo?: string;
  };
  user: Partial<IUser> | null;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = (
  props
) => {
  const { values, user } = props;
  const {
    cstName,
    location,
    mobile,
    email,
    from,
    to,
    numberOfHours,
    numberOfKids,
    ageOfKidsFrom,
    ageOfKidsTo,
    extraInfo,
  } = values;
  console.log("props = ", props);
  console.log("from = ", from);
  console.log("formatDate(from) = ", formatDate(from));

  return (
    <Html>
      <Head />
      <Preview>MOGi KiDS Quotation</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                <Img
                  src={user?.photo ?? "https://www.svgrepo.com/svg/499764/user"}
                  width="180"
                  height="101"
                  alt="Mogi kids logo"
                />
              </Column>
              <Column align="right" style={tableCell}>
                <Text style={heading}>Quotation</Text>
              </Column>
            </Row>
          </Section>

          <Section>
            <Text style={cupomText}>
              Hi, my name is {cstName}, and I am interested in obtaining a
              quotation.
            </Text>
          </Section>

          <Section style={informationTable}>
            <Row style={informationTableRow}>
              <Column colSpan={2}>
                <Section>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>
                        Requesting The Service From Date:
                      </Text>
                      <Text style={informationTableValue}>
                        {formatDate(from) ?? "Not Mentioned."}
                      </Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>
                        Requesting The Service To Date:
                      </Text>
                      <Text style={informationTableValue}>
                        {formatDate(to) ?? "Not Mentioned."}
                      </Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>
                        Service Duration (Hours / Day):
                      </Text>
                      <Text style={informationTableValue}>
                        {numberOfHours ?? "Not Mentioned."}
                      </Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>Kids:</Text>
                      <Text style={informationTableValue}>
                        {numberOfKids ?? "Not Mentioned."}
                      </Text>
                    </Column>
                  </Row>
                  {parseInt(numberOfKids) === 1 ? (
                    <Row>
                      <Column style={informationTableColumn}>
                        <Text style={informationTableLabel}>Kid Age:</Text>
                        <Text style={informationTableValue}>
                          {ageOfKidsFrom ?? "Not Mentioned."}
                        </Text>
                      </Column>
                    </Row>
                  ) : (
                    <>
                      <Row>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>
                            Age OF The Youngest:
                          </Text>
                          <Text style={informationTableValue}>
                            {ageOfKidsFrom ?? "Not Mentioned."}
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>
                            Age OF The Oldest:
                          </Text>
                          <Text style={informationTableValue}>
                            {ageOfKidsTo ?? "Not Mentioned."}
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column style={informationTableColumn} colSpan={2}>
                          <Text style={informationTableLabel}>
                            Extra Info You Should Know:
                          </Text>
                          <Text style={informationTableValue}>
                            {extraInfo ?? "Not Mentioned."}
                          </Text>
                        </Column>
                      </Row>
                    </>
                  )}
                </Section>
              </Column>
            </Row>
          </Section>
          <Section style={productTitleTable}>
            <Text style={productsTitle}>Customer Information</Text>
          </Section>

          <Section>
            <Row>
              <Column style={{ width: "64px" }}>
                <Img
                  src={user?.photo ?? "https://www.svgrepo.com/svg/499764/user"}
                  width="64"
                  height="64"
                  alt="Customer image"
                  style={productIcon}
                />
              </Column>
              <Column style={{ paddingLeft: "22px" }}>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>My Location</Text>
                    <Text style={informationTableValue}>
                      {location ?? "Not Mentioned."}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>Mobile Number</Text>
                    <Text style={informationTableValue}>{mobile}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>Email Address</Text>
                    <Text style={informationTableValue}>{email}</Text>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};

const cupomText = {
  textAlign: "center" as const,
  margin: "36px 0 40px 0",
  fontSize: "26px",
  fontWeight: "500",
  color: "#111111",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "20px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "18px",
};

const informationTableValue = {
  fontSize: "16px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "22px",
  fontWeight: "500",
  margin: "0",
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};
