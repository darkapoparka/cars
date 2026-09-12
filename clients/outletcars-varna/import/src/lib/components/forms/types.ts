export type InquiryInputType = 'date' | 'email' | 'number' | 'tel' | 'text';

type InquiryFieldBase = {
	id?: string;
	label: string;
	name: string;
	wrapperClass?: string;
};

export type InquiryInputField = InquiryFieldBase & {
	active?: boolean;
	kind: 'input';
	placeholder?: string;
	required?: boolean;
	type: InquiryInputType;
	value?: string;
};

export type InquirySelectField = InquiryFieldBase & {
	className?: string;
	kind: 'select';
	options: string[];
	required?: boolean;
};

export type InquiryTextareaField = InquiryFieldBase & {
	className?: string;
	kind: 'textarea';
	placeholder?: string;
	required?: boolean;
	rows?: number;
};

export type InquiryFormField = InquiryInputField | InquirySelectField | InquiryTextareaField;
