import classes from './Content.module.scss'

import * as React from "react";

import LinearProgress from "../LinearProgress";

const styles: React.CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

const Content = (props: { children: React.ReactNode; loading?: boolean }) => (
  <>
    <div className={classes.content} style={styles}>{props.children}</div>
    <LinearProgress progress={props.loading ? undefined : 0} />
  </>
);

export default Content