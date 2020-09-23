import React from "react";
import { Card, Typography, CardContent } from "@material-ui/core";

import "../InfoBox.css";

function InfoBox(props) {
  let titleColor;
  if (props.title === "Cases") {
    titleColor = "#1e5f74";
  } else if (props.title === "Recovered") {
    titleColor = "green";
  } else {
    titleColor = "#ff414d";
  }
  const titleStyle = {
    color: titleColor,
  };

  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${props.dark && "infoBox-dark"}`}
      style={{ borderTop: `3px solid ${props.active ? titleColor : "#D3D3D3"}` }}
    >
      <CardContent>
        <Typography color="textSecondary" className="infoBox__title" style={titleStyle}>
          {props.title}
        </Typography>

        <h2 className={`infoBox__cases ${props.dark && "infoBox-cases-dark"}`}>{props.cases}</h2>

        <Typography color="textSecondary" className={`infoBox__total ${props.dark && "infoBox-total-dark"}`}>
          {props.total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
