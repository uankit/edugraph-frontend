import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Typography, CssBaseline, Box } from "@mui/material";
import FileUpload from "./FileUpload";
import GraphVisualization from "./GraphVisualisation";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}
    >
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h6">EduGraph</Typography>
      </Box>
      <List>
        <ListItem button onClick={() => navigate("/upload")}> 
          <ListItemText primary="📄 Analyze PDF" />
        </ListItem>
        <ListItem button onClick={() => navigate("/visualize")}> 
          <ListItemText primary="📊 Visualize" />
        </ListItem>
      </List>
    </Drawer>
  );
};

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, display: "flex", justifyContent: "center", alignItems: "center", height:"100vh", margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={
              <Box textAlign="center">
                <Typography variant="h3">Welcome to EduGraph</Typography>
                <Typography variant="h6" color="textSecondary">Learn Faster, Learn Better</Typography>
              </Box>
            } />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/visualize" element={<GraphVisualization />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
