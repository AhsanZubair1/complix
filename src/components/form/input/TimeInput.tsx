import Input, { InputProps } from "./InputField";

interface TimeInputProps extends Omit<InputProps, "type"> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return <Input type="time" value={value} onChange={onChange} {...props} />;
};
