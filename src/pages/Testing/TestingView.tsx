import { Button, Card, Grid, Typography } from "@mui/material";

export const TestingView = () => {
  return (
    <Grid
      container
      className="content"
      xs={12}
      gap={2}
      flexDirection={"column"}
    >
      <Card style={{ padding: 20 }}>
        <Typography variant="h3" m={2} textAlign={"center"}>
          Testing
        </Typography>

        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          <Grid item xs={12} ml={6}>
            {/* <Button type="button" variant="contained" onClick={useExample}>
              Use example
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              type="button"
              variant="contained"
              onClick={clear}
            >
              clear
            </Button> */}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
