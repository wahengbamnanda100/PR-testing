// src/features/FolderView/components/panel/DetailsTabPanel.tsx

import {
	AccordionSummary,
	Alert,
	Box,
	CircularProgress,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { StyledAccordian, StyledAccordianDetails } from "../style";

import type { DetailsTabPanelProps } from "../../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
// const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
// 	label,
// 	value,
// }) => (
// 	<Grid container spacing={1} sx={{ mb: 1.5 }}>
// 		<Grid item xs={12} sm={4}>
// 			<Typography
// 				variant="body2"
// 				component="strong"
// 				sx={{ fontWeight: "bold" }}>
// 				{label}:
// 			</Typography>
// 		</Grid>
// 		<Grid item xs={12} sm={8}>
// 			{typeof value === "string" ? (
// 				<Typography
// 					variant="body2"
// 					sx={{
// 						whiteSpace:
// 							label === "Executive Summary" || label === "Examples of Use"
// 								? "pre-wrap"
// 								: "normal",
// 					}}>
// 					{value || "N/A"}
// 				</Typography>
// 			) : (
// 				value || <Typography variant="body2">N/A</Typography>
// 			)}
// 		</Grid>
// 	</Grid>
// );

const DetailsTabPanel: React.FC<DetailsTabPanelProps> = ({
	selectedItem,
	apiData,
	loading,
	error,
}) => {
	const canShowImageBanner =
		selectedItem.type === "serviceDomain" &&
		!loading &&
		!error &&
		apiData &&
		typeof apiData.displayName === "string" &&
		apiData.displayName.trim() !== "";

	const handleImageError = (
		event: React.SyntheticEvent<HTMLImageElement, Event>
	) => {
		event.currentTarget.style.display = "none";
		// The container Box's grey background will then be visible.
		// We might want to also hide the overlay or change its style.
		// For now, just hiding the image.
		const overlay = event.currentTarget.nextElementSibling; // Assumes overlay is the next sibling
		if (overlay && overlay instanceof HTMLElement) {
			overlay.style.display = "none"; // Also hide the gradient overlay if image fails
		}
	};

	return (
    <>
      {canShowImageBanner && apiData && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "150px", sm: "200px" },
            mb: 3,
            backgroundColor: "grey.200", // Fallback if image fails and onError doesn't hide overlay
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <img
            src={`https://bianstorage.blob.core.windows.net/model-sandbox/ServiceDomain/${encodeURIComponent(
              apiData.displayName!
            )}/1.png`}
            alt={`${selectedItem.name} banner`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={handleImageError}
          />
          {/* Gradient overlay for text readability */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "flex-end", // Align text to the bottom
              justifyContent: "flex-start", // Align text to the left
              // Gradient: Darker at the bottom, fading to transparent upwards
              // This helps text stand out without obscuring the whole image
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 50%)",
              p: { xs: 1.5, sm: 2 }, // Padding for the text from edges
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "left",
                textShadow: "1px 1px 4px rgba(0,0,0,0.9)", // Stronger shadow for better readability
                // Optional: constrain width if titles can be very long
                // maxWidth: '70%',
              }}
            >
              {selectedItem.name}
            </Typography>
          </Box>
        </Box>
      )}

      {/* {!canShowImageBanner && (
				<Typography variant="h6" gutterBottom component="div">
					{selectedItem.name}
				</Typography>
			)} */}

      <Divider sx={{ my: 2 }} />

      {selectedItem.type === "serviceDomain" ? (
        <>
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading API details...</Typography>
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              Error fetching API details:{" "}
              {typeof error === "string" ? error : (error as Error).message}
            </Alert>
          )}
          {apiData && !loading && !error && (
            <Stack spacing={1} direction={"column"} paddingRight={1}>
              <StyledAccordian>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Example Of Use
                </AccordionSummary>
                <StyledAccordianDetails sx={{ fontSize: "16px" }}>
                  {apiData.examplesOfUse || "No Example Of Use"}
                </StyledAccordianDetails>
              </StyledAccordian>
              <StyledAccordian>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Role Of Definition
                </AccordionSummary>
                <StyledAccordianDetails>
                  {apiData.roleDefinition || "No Role Of Definition"}
                </StyledAccordianDetails>
              </StyledAccordian>
              <StyledAccordian>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Key Features
                </AccordionSummary>
                <StyledAccordianDetails>
                  {apiData.keyFeatures || "No Key Features"}
                </StyledAccordianDetails>
              </StyledAccordian>
            </Stack>
          )}
          {!apiData?.displayName && apiData && !loading && !error && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Detailed information available. Banner image could not be loaded
              due to missing display name.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Detailed API information!!@ is typically available for Service
          Domains. Detailed API information!!@ is typically available for
          Service Domains. Detailed API information!!@ is typically available
          for Service Domains.
        </Typography>
      )}
    </>
  );
};

export default DetailsTabPanel;
