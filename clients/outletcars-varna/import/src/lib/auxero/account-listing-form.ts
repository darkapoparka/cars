export type AuxeroListingFormMode = 'clone-static' | 'create' | 'edit';

export type AuxeroListingFormHiddenField = {
	name: string;
	value: string;
};

export type AuxeroListingFormImage = {
	alt: string;
	src: string;
};

export type AuxeroListingFormOption = {
	checked?: boolean;
	label: string;
	name?: string;
	value: string;
};

export type AuxeroListingFormDropdownField = {
	id: string;
	label: string;
	name: string;
	options: AuxeroListingFormOption[];
	type: 'dropdown';
	wrapperClass: string;
};

export type AuxeroListingFormInputField = {
	id: string;
	label: string;
	name: string;
	placeholder: string;
	required?: boolean;
	type: 'input';
	value: string;
	wrapperClass: string;
};

export type AuxeroListingFormTextareaField = {
	id: string;
	label: string;
	name: string;
	placeholder: string;
	required?: boolean;
	rows: number;
	type: 'textarea';
	value: string;
	wrapperClass: string;
};

export type AuxeroListingFormDetailField =
	| AuxeroListingFormDropdownField
	| AuxeroListingFormInputField
	| AuxeroListingFormTextareaField;

export type AuxeroListingFormFeature = {
	checked?: boolean;
	id: string;
	label: string;
};

export type AuxeroListingFormFeatureGroup = {
	features: AuxeroListingFormFeature[];
	title: string;
};

export type AuxeroListingFormAttachment = {
	icon: string;
	label: string;
	type: string;
};

export type AuxeroAccountListingFormData = {
	address: string;
	attachments: AuxeroListingFormAttachment[];
	detailFields: AuxeroListingFormDetailField[];
	featureGroups: AuxeroListingFormFeatureGroup[];
	galleryImages: AuxeroListingFormImage[];
	hiddenFields: AuxeroListingFormHiddenField[];
	locationOptions: AuxeroListingFormOption[];
	mapEmbedUrl: string;
	mode: AuxeroListingFormMode;
	previewImage: AuxeroListingFormImage;
	priceLabel: string;
	sourceUrl: string;
};
