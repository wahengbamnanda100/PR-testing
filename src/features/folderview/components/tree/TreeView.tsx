/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	Box,
	List,
	Typography,
	Divider,
	ListItem,
	Avatar,
	Skeleton,
} from "@mui/material";
// import { AxiosResponse } from "axios";
// import { getServiceDomainBasicByUID } from "../../service/api";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import LabelBody from "./LabelBody";
import SOLabel from "./SOLable";
import {
	CloseSquare,
	LabelWithLazyIndicator,
	LazyDataState,
	MinusSquare,
	PlusSquare,
	renderLazyContent,
	StyledTreeItem,
} from "./TreeComponent";
import { useEffect, useState } from "react";
import { serviceDomainApi } from "../../hooks/api";

interface ApiEndpointTypes {
	path: string;
}

interface attrmapProp {
	attributes: attrmapProp[];
	baseCRBQName?: string;
	actionTerm?: string;
	apiEndpoint?: ApiEndpointTypes;
	serviceDomainName?: string;
	bianId: string;
	boType?: string;
	dataType: string;
	dataTypeBianId: string;
	description: string;
	direction: string | null;
	name: string;
	parentObjectName: string | null;
	reference: string;
	type: string;
	status?: string;
	uid?: string;
	meta?: any;
	inputAttributes: attrmapProp[];
	outputAttributes: attrmapProp[];
}

function replaceLastSegmentWithLabel(id?: string, label?: string): string {
	if (!id || !label || typeof id !== "string" || typeof label !== "string") {
		return "";
	}

	// Format label to PascalCase
	const formattedLabel = label
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("");

	const lastDashIndex = id.lastIndexOf("-");
	if (lastDashIndex === -1) return formattedLabel;

	return id.slice(0, lastDashIndex + 1) + formattedLabel;
}

const TreeViewComponent = ({
	treeData,
	parentUId,
	loading,
	type = "serviceDomain",
}: {
	treeData: any;
	parentUId?: string;
	loading: boolean;
	type:
		| "serviceDomain"
		| "businessDomain"
		| "businessScenario"
		| "serviceOperation"
		| "behaviourQualifier"
		| "root"
		| "controlRecord";
}) => {
	const [lazyData, setLazyData] = useState<LazyDataState>({
		controlRecord: {
			loading: false,
			error: null,
			data: null,
			hasLoaded: false,
		},
		behaviourQualifiers: {
			loading: false,
			error: null,
			data: null,
			hasLoaded: false,
		},
		serviceOperations: {
			loading: false,
			error: null,
			data: null,
			hasLoaded: false,
		},
		businessArea: { loading: false, error: null, data: null, hasLoaded: false },
		inputAttributes: {
			loading: false,
			error: null,
			data: null,
			hasLoaded: false,
		},
		outputAttributes: {
			loading: false,
			error: null,
			data: null,
			hasLoaded: false,
		},
	});
	const handleExpansionToggle = async (
		event: React.SyntheticEvent,
		nodeId: string,
		isExpanded: boolean
	) => {
		console.log("handle expansion", event, nodeId, isExpanded, treeData);
		const uid = treeData.uid;

		if (!isExpanded) {
			return;
		}

		const nodeKey = nodeId as keyof LazyDataState;
		const nodeState = lazyData[nodeKey];

		if (!nodeState || nodeState.hasLoaded || nodeState.loading) {
			return;
		}

		setLazyData((prev) => ({
			...prev,
			[nodeKey]: { ...prev[nodeKey], loading: true, error: null },
		}));

		try {
			let fetchedData: any = null;

			switch (nodeKey) {
				case "controlRecord": {
					// IMPORTANT: Get the specific UID for the control record
					// const uid = treeData.controlRecord?.uid;
					if (!uid) throw new Error("Control Record UID is missing.");
					fetchedData = await serviceDomainApi.getControlRecordByUID(uid);

					break;
				}
				case "behaviourQualifiers": {
					// const uid = treeData.behaviourQualifiers?.uid; // Adjust path as needed
					if (!uid) throw new Error("Behaviour Qualifiers UID is missing.");
					fetchedData = await serviceDomainApi.getBehaviourQualifiersByUID(uid);
					break;
				}
				case "serviceOperations": {
					const bianId = treeData.bianId; // Or wherever the correct ID is
					if (!bianId)
						throw new Error("Parent BianId is missing for Service Operations.");
					fetchedData = await serviceDomainApi.getServiceOperationsByBianId(
						bianId
					);
					break;
				}
				// Add other cases here...
				default:
					// If it's not a known lazy node, do nothing.
					return;
			}

			setLazyData((prev) => ({
				...prev,
				[nodeKey]: {
					loading: false,
					error: null,
					data: fetchedData,
					hasLoaded: true, // Mark as loaded
				},
			}));
		} catch (err: any) {
			setLazyData((prev) => ({
				...prev,
				[nodeKey]: {
					...prev[nodeKey],
					loading: false,
					error: err.message || "Failed to load content.",
					hasLoaded: false, // Allow user to try again
				},
			}));
		}
	};

	useEffect(() => {
		console.log("treev iew effect parent uis", { parentUId });
	}, [parentUId]);

	const handleAttributeClick = (type?: string) => {
		console.log("Attribute clicked:", type);
		// Implement your logic here, e.g., navigate to a detail view or open a modal
	};

	if (loading) {
		return (
			<List>
				{[...Array(7)].map((_, index) => (
					<ListItem key={index} sx={{ display: "flex", gap: 2, width: "100%" }}>
						<Avatar>
							<Skeleton
								animation="wave"
								variant="circular"
								width={50}
								height={50}
							/>
						</Avatar>
						<Typography>
							<Skeleton animation="wave" height={50} width={300} />
						</Typography>
					</ListItem>
				))}
			</List>
		);
	}

	const controlRecord = (treeData) => {
		return (
			<StyledTreeItem
				style={{ border: "3px solid #fff" }}
				itemId="controlRecord"
				lazyLoad={true}
				label={
					<LabelBody
						title={
							// <LabelWithLazyIndicator
							// 	isLazy={true}
							// 	hasLoaded={lazyData.controlRecord.hasLoaded}>
							<div style={{ display: "inline-flex" }}>
								{treeData?.controlRecord?.name
									? treeData?.controlRecord?.name
									: ""}
								<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
									Control Record
								</div>
							</div>
							// </LabelWithLazyIndicator>
						}
						description={treeData?.controlRecord?.description}
						status={treeData?.controlRecord?.status}
						data_type={treeData?.controlRecord?.dataType}
						type1="controlRecord"
						serOrFeed="service"
						level="level1"
						//editId={treeData?.controlRecord?.uid}
						editEnabled={false}
						//showCompareRadio={false}
						//meta={treeData?.controlRecord?.meta}
					/>
				}>
				{/* {lazyData.controlRecord.hasLoaded === false && (
					<div style={{ display: "none" }} />
				)} */}
				{treeData?.controlRecord?.attributes.map((attrmap: attrmapProp) => (
					<StyledTreeItem
						style={{ border: "3px solid #fff" }}
						itemId={"controlRecord-" + attrmap?.name}
						// onClick={() => selectDataType(attrmap)}

						label={
							<>
								<LabelBody
									title={
										<div style={{ cursor: "pointer" }}> {attrmap.name}</div>
									}
									//   title={attrmap.name}
									description={<div>{attrmap.description}</div>}
									sec-desc={attrmap.dataType}
									status={attrmap?.status}
									data_type={
										<>
											<div style={{ cursor: "pointer" }}>
												{attrmap?.dataType}
											</div>
										</>
									}
									// data_type2={attrmap?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap?.boType}</div></> : null}
									type1="controlRecord"
									serOrFeed="service"
									level="level2"
									//editId={attrmap?.uid}
									editEnabled={false}
									//showCompareRadio={false}
									//meta={attrmap?.meta}
								/>
							</>
						}
					/>
				))}
			</StyledTreeItem>
		);
	};

	const behaviourQualifiers = (treeData) => {
		return (
			<StyledTreeItem
				style={{ border: "3px solid #fff" }}
				itemId="behaviourQualifiers"
				lazyLoad={true}
				label={
					<LabelBody
						title={
							// <LabelWithLazyIndicator
							// 	isLazy={true}
							// 	hasLoaded={lazyData.behaviourQualifiers.hasLoaded}>
							<div style={{ display: "inline-flex" }}>
								Behaviour Qualifiers
								<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
									Behaviour Qualifiers
								</div>
							</div>
							// </LabelWithLazyIndicator>
						}
						description=""
						status=""
						data_type=""
						type1="behaviourQualifiers"
						serOrFeed="service"
						level="level1"
						//editId=""
						editEnabled={false}
						//showCompareRadio={false}
						//meta={treeData?.behaviourQualifiers?.meta}
					/>
				}>
				{lazyData.behaviourQualifiers.hasLoaded === false && (
					<div style={{ display: "none" }} />
				)}

				{treeData?.behaviourQualifiers?.map((attrmap: attrmapProp) => (
					<StyledTreeItem
						style={{ border: "3px solid #fff" }}
						itemId={"behaviourQualifiers-" + attrmap?.name}
						// itemId={"behaviourQualifiers-" + attrmap?.id}
						label={
							<LabelBody
								title={attrmap.name}
								description={attrmap.description}
								status={attrmap?.status}
								data_type={attrmap?.dataType}
								// data_type2={attrmap?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap?.boType}</div></> : null}

								type1="behaviourQualifiers"
								serOrFeed="service"
								level="level2"
								//editId={attrmap?.uid}
								editEnabled={false}
								//showCompareRadio={false}
								//meta={attrmap?.meta}
							/>
						}>
						{attrmap.attributes?.length > 0 &&
							attrmap.attributes.map((attrmap2: attrmapProp) => (
								<StyledTreeItem
									// style={{ border: "3px solid #fff" }}
									itemId={
										"behaviourQualifiers-" +
										attrmap?.name +
										"-" +
										attrmap2?.name
									}
									label={
										<>
											<LabelBody
												title={attrmap2.name}
												description={attrmap2.description}
												status={attrmap2?.status}
												data_type={attrmap2?.dataType}
												// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
												boType={attrmap2?.boType}
												type1="behaviourQualifiers"
												serOrFeed="service"
												level="level3"
												//editId={attrmap2?.uid}
												editEnabled={false}
												//showCompareRadio={false}
												//meta={attrmap2?.meta}
											/>
										</>
									}
								/>
							))}
					</StyledTreeItem>
				))}
			</StyledTreeItem>
		);
	};

	const serviceOperation = (treeData, parentUid) => {
		// console.log("parnt uid", parentUid);

		return (
			<StyledTreeItem
				style={{ border: "3px solid #fff" }}
				itemId="serviceOperations"
				lazyLoad={true}
				label={
					<LabelBody
						title={
							// <LabelWithLazyIndicator
							// 	isLazy={true}
							// 	hasLoaded={lazyData.serviceOperations.hasLoaded}>
							<div style={{ display: "inline-flex" }}>
								Service Operations
								<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
									Service Operations
								</div>
							</div>
							// </LabelWithLazyIndicator>
						}
						description=""
						status=""
						data_type=""
						type1="serviceOperations"
						serOrFeed="service"
						level="level1"
						//editId=""
						editEnabled={false}
						//showCompareRadio={false}
						//meta={treeData?.serviceOperations?.meta}
					/>
				}>
				{lazyData.serviceOperations.hasLoaded === false && (
					<div style={{ display: "none" }} />
				)}
				{treeData?.map((attrmap: attrmapProp) => {
					const uid = replaceLastSegmentWithLabel(
						attrmap.uid,
						attrmap.serviceDomainName
					);
					return (
						<StyledTreeItem
							style={{ border: "3px solid #fff" }}
							itemId={"serviceOperations-" + attrmap?.bianId}
							label={
								<>
									<SOLabel
										title={attrmap.baseCRBQName!}
										action={attrmap.actionTerm!}
										endpoint={attrmap?.apiEndpoint?.path || ""}
										type={attrmap?.type}
										status={attrmap?.status}
										data_type={attrmap?.dataType}
										uid={uid}
										type1="serviceOperations"
										serOrFeed="service"
										level="level2"
										//editId={attrmap?.uid}
										editEnabled={false}
										//showCompareRadio={false}
										//meta={attrmap?.meta}
									/>
								</>
							}>
							{attrmap.inputAttributes?.length > 0 && (
								<Box
									sx={{
										border: "1px solid rgba(0, 0, 0, 0.12)",
										boxShadow: 1,
										mt: 1,
									}}>
									<Typography
										gutterBottom
										variant="h6"
										component="h6"
										sx={{ textAlign: "center" }}>
										Input Attributes
									</Typography>
									<Divider sx={{ margin: "8px 0" }} />

									{attrmap.inputAttributes?.length > 0 &&
										attrmap.inputAttributes.map((attrmap2: attrmapProp) => (
											<StyledTreeItem
												// style={{ border: "3px solid #fff" }}

												itemId={"serviceOperations-1-" + attrmap2?.bianId}
												label={
													<LabelBody
														handleItemClick={handleAttributeClick}
														title={attrmap2.name}
														description={attrmap2.description}
														status={attrmap2?.status}
														// data_type={attrmap2?.dataType}
														// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
														boType={attrmap2?.boType}
														type1="serviceOperations"
														serOrFeed="service"
														level="level3"
														//editId={attrmap2?.uid}
														editEnabled={false}
														//showCompareRadio={false}
														//meta={attrmap2?.meta}
													/>
												}
												lazyLoad={true}>
												{lazyData.controlRecord.hasLoaded === false && (
													<div style={{ display: "none" }} />
												)}
											</StyledTreeItem>
										))}
								</Box>
							)}
							{attrmap.outputAttributes?.length > 0 && (
								<Box
									sx={{
										border: "1px solid rgba(0, 0, 0, 0.12)",
										boxShadow: 1,
										mt: 1,
									}}>
									<Typography
										gutterBottom
										variant="h6"
										component="h6"
										sx={{ textAlign: "center" }}>
										Output Attributes
									</Typography>
									<Divider sx={{ margin: "8px 0" }} />

									{attrmap.outputAttributes?.length > 0 &&
										attrmap.outputAttributes.map((attrmap2) => (
											<StyledTreeItem
												// style={{ border: "3px solid #fff" }}
												itemId={"serviceOperations-2-" + attrmap2?.bianId}
												label={
													<LabelBody
														title={attrmap2.name}
														description={attrmap2.description}
														status={attrmap2?.status}
														// data_type={attrmap2?.dataType}
														// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
														boType={attrmap2?.boType}
														type1="serviceOperations"
														serOrFeed="service"
														level="level3"
														//editId={attrmap2?.uid}
														editEnabled={false}
														//showCompareRadio={false}
														//meta={attrmap2?.meta}
													/>
												}
												lazyLoad={true}>
												{lazyData.outputAttributes.hasLoaded === false && (
													<div style={{ display: "none" }} />
												)}
											</StyledTreeItem>
										))}
								</Box>
							)}
						</StyledTreeItem>
					);
				})}
			</StyledTreeItem>
		);
	};

	const serviceDomain = (treeData) => {
		return (
			<>
				<StyledTreeItem
					itemId="characteristics"
					label={
						<LabelBody
							title={
								<div style={{ display: "inline-flex" }}>
									{treeData?.characteristics?.functionalPattern
										? treeData?.characteristics?.functionalPattern
										: ""}
									<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
										Characteristics
									</div>
								</div>
							}
							description={treeData?.characteristics?.assetType}
							sec-desc={treeData?.characteristics?.genericArtefactType}
							status={treeData?.characteristics?.status}
							data_type={treeData?.characteristics?.dataType}
							type1="characteristics"
							serOrFeed="service"
							level="level1"
							//editId={treeData?.characteristics?.uid}
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.characteristics?.meta}
						/>
					}
				/>
				{/* 1st Tree Item end */}

				{/* 2nd Tree Item starts */}
				<StyledTreeItem
					itemId="businessArea"
					label={
						<LabelBody
							title={
								// treeItem?.businessArea?.name
								//   ? treeItem?.businessArea?.name
								//   : "Business Domain"
								<div style={{ display: "inline-flex" }}>
									{treeData?.businessArea?.name
										? treeData?.businessArea?.name
										: ""}
									<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
										Business Area
									</div>
								</div>
							}
							description={treeData?.businessArea?.description}
							status={treeData?.businessArea?.status}
							data_type={treeData?.businessArea?.dataType}
							type1="businessArea"
							serOrFeed="service"
							level="level1"
							//editId={treeData?.businessArea?.uid}
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.businessArea?.meta}
						/>
					}
				/>
				{/* 2nd Tree Item end */}

				{/* 3rd Tree Item starts */}
				<StyledTreeItem
					itemId="businessDomain"
					label={
						<LabelBody
							title={
								// treeItem?.businessDomain?.name
								//   ? treeItem?.businessDomain?.name
								//   : "Business Domain"

								<div style={{ display: "inline-flex" }}>
									{treeData?.businessDomain?.name
										? treeData?.businessDomain?.name
										: ""}
									<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
										Business Domain
									</div>
								</div>
							}
							description={treeData?.businessDomain?.description}
							status={treeData?.businessDomain?.status}
							data_type={treeData?.businessDomain?.dataType}
							type1="businessDomain"
							serOrFeed="service"
							level="level1"
							//editId={treeData?.businessDomain?.uid}
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.businessDomain?.meta}
						/>
					}
				/>
				{/* 3rd Tree Item end */}

				{/* 4th Tree Item starts */}
				<StyledTreeItem
					style={{ border: "3px solid #fff" }}
					itemId="controlRecord"
					lazyLoad={true}
					label={
						<LabelBody
							title={
								<LabelWithLazyIndicator
									isLazy={true}
									hasLoaded={lazyData.controlRecord.hasLoaded}>
									<div style={{ display: "inline-flex" }}>
										{treeData?.controlRecord?.name
											? treeData?.controlRecord?.name
											: ""}
										<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
											Control Record
										</div>
									</div>
								</LabelWithLazyIndicator>
							}
							description={treeData?.controlRecord?.description}
							status={treeData?.controlRecord?.status}
							data_type={treeData?.controlRecord?.dataType}
							type1="controlRecord"
							serOrFeed="service"
							level="level1"
							//editId={treeData?.controlRecord?.uid}
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.controlRecord?.meta}
						/>
					}>
					{lazyData.controlRecord.hasLoaded === false && (
						<div style={{ display: "none" }} />
					)}
					{renderLazyContent(lazyData.controlRecord, () =>
						lazyData.controlRecord.data?.controlRecord?.attributes.map(
							(attrmap: attrmapProp) => (
								<StyledTreeItem
									style={{ border: "3px solid #fff" }}
									itemId={"controlRecord-" + attrmap?.bianId}
									// onClick={() => selectDataType(attrmap)}

									label={
										<>
											<LabelBody
												title={
													<div style={{ cursor: "pointer" }}>
														{" "}
														{attrmap.name}
													</div>
												}
												//   title={attrmap.name}
												description={<div>{attrmap.description}</div>}
												sec-desc={attrmap.dataType}
												status={attrmap?.status}
												data_type={
													<>
														<div style={{ cursor: "pointer" }}>
															{attrmap?.dataType}
														</div>
													</>
												}
												// data_type2={attrmap?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap?.boType}</div></> : null}
												type1="controlRecord"
												serOrFeed="service"
												level="level2"
												//editId={attrmap?.uid}
												editEnabled={false}
												//showCompareRadio={false}
												//meta={attrmap?.meta}
											/>
										</>
									}
								/>
							)
						)
					)}
				</StyledTreeItem>
				{/* 4th Tree Item end */}

				{/* 5th Tree Item starts */}
				<StyledTreeItem
					style={{ border: "3px solid #fff" }}
					itemId="behaviourQualifiers"
					lazyLoad={true}
					label={
						<LabelBody
							title={
								<LabelWithLazyIndicator
									isLazy={true}
									hasLoaded={lazyData.behaviourQualifiers.hasLoaded}>
									<div style={{ display: "inline-flex" }}>
										Behaviour Qualifiers
										<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
											Behaviour Qualifiers
										</div>
									</div>
								</LabelWithLazyIndicator>
							}
							description=""
							status=""
							data_type=""
							type1="behaviourQualifiers"
							serOrFeed="service"
							level="level1"
							//editId=""
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.behaviourQualifiers?.meta}
						/>
					}>
					{lazyData.behaviourQualifiers.hasLoaded === false && (
						<div style={{ display: "none" }} />
					)}

					{renderLazyContent(lazyData.behaviourQualifiers, () =>
						lazyData.behaviourQualifiers.data?.behaviourQualifiers?.map(
							(attrmap: attrmapProp) => (
								<StyledTreeItem
									style={{ border: "3px solid #fff" }}
									itemId={"behaviourQualifiers-" + attrmap?.bianId}
									// itemId={"behaviourQualifiers-" + attrmap?.id}
									label={
										<LabelBody
											title={attrmap.name}
											description={attrmap.description}
											status={attrmap?.status}
											data_type={attrmap?.dataType}
											// data_type2={attrmap?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap?.boType}</div></> : null}

											type1="behaviourQualifiers"
											serOrFeed="service"
											level="level2"
											//editId={attrmap?.uid}
											editEnabled={false}
											//showCompareRadio={false}
											//meta={attrmap?.meta}
										/>
									}>
									{attrmap.attributes?.length > 0 &&
										attrmap.attributes.map((attrmap2: attrmapProp) => (
											<StyledTreeItem
												// style={{ border: "3px solid #fff" }}
												itemId={
													"behaviourQualifiers-" +
													attrmap?.bianId +
													"-" +
													attrmap2?.bianId
												}
												label={
													<>
														<LabelBody
															title={attrmap2.name}
															description={attrmap2.description}
															status={attrmap2?.status}
															data_type={attrmap2?.dataType}
															// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
															boType={attrmap2?.boType}
															type1="behaviourQualifiers"
															serOrFeed="service"
															level="level3"
															//editId={attrmap2?.uid}
															editEnabled={false}
															//showCompareRadio={false}
															//meta={attrmap2?.meta}
														/>
													</>
												}
											/>
										))}
								</StyledTreeItem>
							)
						)
					)}
				</StyledTreeItem>
				{/* 5th Tree Item end */}

				{/* 6th Tree Item starts */}
				<StyledTreeItem
					style={{ border: "3px solid #fff" }}
					itemId="serviceOperations"
					lazyLoad={true}
					label={
						<LabelBody
							title={
								<LabelWithLazyIndicator
									isLazy={true}
									hasLoaded={lazyData.serviceOperations.hasLoaded}>
									<div style={{ display: "inline-flex" }}>
										Service Operations
										<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
											Service Operations
										</div>
									</div>
								</LabelWithLazyIndicator>
							}
							description=""
							status=""
							data_type=""
							type1="serviceOperations"
							serOrFeed="service"
							level="level1"
							//editId=""
							editEnabled={false}
							//showCompareRadio={false}
							//meta={treeData?.serviceOperations?.meta}
						/>
					}>
					{lazyData.serviceOperations.hasLoaded === false && (
						<div style={{ display: "none" }} />
					)}
					{renderLazyContent(lazyData.serviceOperations, () =>
						lazyData.serviceOperations?.data.map((attrmap: attrmapProp) => (
							<StyledTreeItem
								style={{ border: "3px solid #fff" }}
								itemId={"serviceOperations-" + attrmap?.bianId}
								label={
									<>
										<SOLabel
											title={attrmap.baseCRBQName!}
											action={attrmap.actionTerm!}
											endpoint={attrmap?.apiEndpoint?.path || ""}
											type={attrmap?.type}
											status={attrmap?.status}
											data_type={attrmap?.dataType}
											uid={treeData.uid}
											type1="serviceOperations"
											serOrFeed="service"
											level="level2"
											//editId={attrmap?.uid}
											editEnabled={false}
											//showCompareRadio={false}
											//meta={attrmap?.meta}
										/>
									</>
								}>
								{attrmap.inputAttributes?.length > 0 && (
									<Box
										sx={{
											border: "1px solid rgba(0, 0, 0, 0.12)",
											boxShadow: 1,
											mt: 1,
										}}>
										<Typography
											gutterBottom
											variant="h6"
											component="h6"
											sx={{ textAlign: "center" }}>
											Input Attributes
										</Typography>
										<Divider sx={{ margin: "8px 0" }} />

										{attrmap.inputAttributes?.length > 0 &&
											attrmap.inputAttributes.map((attrmap2: attrmapProp) => (
												<StyledTreeItem
													// style={{ border: "3px solid #fff" }}

													itemId={"serviceOperations-1-" + attrmap2?.bianId}
													label={
														<LabelBody
															handleItemClick={handleAttributeClick}
															title={attrmap2.name}
															description={attrmap2.description}
															status={attrmap2?.status}
															// data_type={attrmap2?.dataType}
															// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
															boType={attrmap2?.boType}
															type1="serviceOperations"
															serOrFeed="service"
															level="level3"
															//editId={attrmap2?.uid}
															editEnabled={false}
															//showCompareRadio={false}
															//meta={attrmap2?.meta}
														/>
													}
													lazyLoad={true}>
													{lazyData.controlRecord.hasLoaded === false && (
														<div style={{ display: "none" }} />
													)}
												</StyledTreeItem>
											))}
									</Box>
								)}
								{attrmap.outputAttributes?.length > 0 && (
									<Box
										sx={{
											border: "1px solid rgba(0, 0, 0, 0.12)",
											boxShadow: 1,
											mt: 1,
										}}>
										<Typography
											gutterBottom
											variant="h6"
											component="h6"
											sx={{ textAlign: "center" }}>
											Output Attributes
										</Typography>
										<Divider sx={{ margin: "8px 0" }} />

										{attrmap.outputAttributes?.length > 0 &&
											attrmap.outputAttributes.map((attrmap2) => (
												<StyledTreeItem
													// style={{ border: "3px solid #fff" }}
													itemId={"serviceOperations-2-" + attrmap2?.bianId}
													label={
														<LabelBody
															title={attrmap2.name}
															description={attrmap2.description}
															status={attrmap2?.status}
															// data_type={attrmap2?.dataType}
															// data_type2={attrmap2?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap2?.boType}</div></> : null}
															boType={attrmap2?.boType}
															type1="serviceOperations"
															serOrFeed="service"
															level="level3"
															//editId={attrmap2?.uid}
															editEnabled={false}
															//showCompareRadio={false}
															//meta={attrmap2?.meta}
														/>
													}
													lazyLoad={true}>
													{lazyData.outputAttributes.hasLoaded === false && (
														<div style={{ display: "none" }} />
													)}
												</StyledTreeItem>
											))}
									</Box>
								)}
							</StyledTreeItem>
						))
					)}
				</StyledTreeItem>
				{/* 6th Tree Item end */}

				{/* 7rd Tree Item Start */}
				{treeData?.businessScenarios?.length !== 0 && (
					<List
						component="nav"
						aria-label="main mailbox folders"
						style={{ cursor: "pointer" }}>
						<StyledTreeItem
							style={{ border: "3px solid #fff", cursor: "pointer" }}
							itemId="businessScenarios"
							label={
								<LabelBody
									//   sx={{ cursor: 'pointer' }}

									title={
										// ""
										<div style={{ display: "inline-flex" }}>
											Business Scenarios
											<div style={{ paddingLeft: "10px", color: "#a19c9c" }}>
												Business Scenarios
											</div>
										</div>
									}
									description=""
									status=""
									data_type=""
									type1="businessScenarios"
									serOrFeed="service"
									level="level1"
									//editId=""
									editEnabled={false}
									//showCompareRadio={false}
									//meta={treeData?.businessScenarios?.meta}
								/>
							}>
							{treeData?.businessScenarios?.length > 0 &&
								treeData?.businessScenarios?.map((attrmap: attrmapProp) => (
									// <Link to={`/dashboard/business-scenario/${organisation}/${version}/${attrmap.name.replaceAll(' ','-')}`} style={{ display: "flex", color: "black", alignItems: 'center' }}>

									<StyledTreeItem
										// style={{ border: "3px solid #fff", cursor: 'pointer' }}
										itemId={"businessScenarios-" + attrmap?.uid}
										// onClick={() => selectBusinessScenario(attrmap)}
										label={
											<LabelBody
												title={
													<div style={{ cursor: "pointer" }}>
														{attrmap.name}
													</div>
												}
												description={attrmap.description}
												sec-desc={attrmap.dataType}
												status={attrmap?.status}
												data_type={attrmap?.dataType}
												// data_type2={attrmap?.boType ? <><div style={{ cursor: 'pointer' }}>{attrmap?.boType}</div></> : null}
												type1="businessScenarios"
												serOrFeed="service"
												level="level2"
												//editId={attrmap?.uid}
												editEnabled={false}
												//showCompareRadio={false}
												//meta={attrmap?.meta}
											/>
										}
									/>
								))}
						</StyledTreeItem>
					</List>
				)}
				{/* 7rd Tree Item End */}
			</>
		);
	};

	return (
		<Box
			sx={{
				width: "95%",
				height: "fit-content",
			}}>
			<SimpleTreeView
				sx={{
					width: "100%",
					// border: "1px dashed #4a4a4c",
					// borderRadius: "10px",
				}}
				aria-label="customized"
				defaultExpandedItems={["1"]}
				slots={{
					expandIcon: PlusSquare,
					collapseIcon: MinusSquare,
					endIcon: CloseSquare,
				}}
				style={{ cursor: "pointer" }}
				onItemExpansionToggle={handleExpansionToggle}>
				{type === "serviceDomain"
					? serviceDomain(treeData)
					: type === "behaviourQualifier"
					? behaviourQualifiers(treeData)
					: type === "controlRecord"
					? controlRecord(treeData)
					: type === "serviceOperation"
					? serviceOperation(treeData, parentUId)
					: null}
			</SimpleTreeView>
		</Box>
	);
};

export default TreeViewComponent;
