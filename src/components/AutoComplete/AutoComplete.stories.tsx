import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AutoComplete } from "./AutoComplete";

// Mock data for stories
const basicOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
];

const countriesOptions = [
  { value: "id", label: "Indonesia", subLabel: "Republic of Indonesia" },
  { value: "us", label: "United States", subLabel: "United States of America" },
  {
    value: "uk",
    label: "United Kingdom",
    subLabel: "United Kingdom of Great Britain",
  },
  { value: "jp", label: "Japan", subLabel: "Land of the Rising Sun" },
  { value: "au", label: "Australia", subLabel: "Commonwealth of Australia" },
  { value: "ca", label: "Canada", subLabel: "Dominion of Canada" },
  { value: "fr", label: "France", subLabel: "French Republic" },
  { value: "de", label: "Germany", subLabel: "Federal Republic of Germany" },
];

const peopleOptions = [
  { value: "john", label: "John Doe", subLabel: "Software Engineer" },
  { value: "jane", label: "Jane Smith", subLabel: "Product Manager" },
  { value: "bob", label: "Bob Johnson", subLabel: "UX Designer" },
  { value: "alice", label: "Alice Brown", subLabel: "Data Scientist" },
  { value: "charlie", label: "Charlie Wilson", subLabel: "DevOps Engineer" },
  { value: "diana", label: "Diana Davis", subLabel: "Frontend Developer" },
];

// Extract the props type from the component
type AutoCompleteProps = React.ComponentProps<typeof AutoComplete>;

// Story component wrapper that handles state
function AutoCompleteStory(
  props: Partial<AutoCompleteProps> & {
    options: AutoCompleteProps["options"];
    initialValue?: string;
  }
) {
  const { initialValue = "", ...restProps } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <div className="w-80">
      <AutoComplete {...restProps} value={value} onValueChange={setValue} />
    </div>
  );
}

const meta = {
  title: "Components/AutoComplete",
  component: AutoCompleteStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    disabled: {
      control: "boolean",
      description: "Whether the autocomplete is disabled",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    initialValue: {
      control: "text",
      description: "Initial selected value",
    },
  },
} satisfies Meta<typeof AutoCompleteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    placeholder: "Pilih buah...",
    options: basicOptions,
  },
};

// With sub-labels
export const WithSubLabels: Story = {
  args: {
    placeholder: "Pilih negara...",
    options: countriesOptions,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: "Pilih buah...",
    options: basicOptions,
    disabled: true,
    initialValue: "apple",
  },
};

// With error
export const WithError: Story = {
  args: {
    placeholder: "Pilih buah...",
    options: basicOptions,
    error: "Pilihan harus diisi",
  },
};

// Empty options
export const EmptyOptions: Story = {
  args: {
    placeholder: "Tidak ada data...",
    options: [],
  },
};

// Pre-selected value
export const PreSelected: Story = {
  args: {
    placeholder: "Pilih buah...",
    options: basicOptions,
    initialValue: "banana",
  },
};

// Custom option renderer
export const CustomRenderer: Story = {
  args: {
    placeholder: "Pilih orang...",
    options: peopleOptions,
    renderOption: (option) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {option.label
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{option.label}</span>
          {option.subLabel && (
            <span className="text-xs text-muted-foreground">
              {option.subLabel}
            </span>
          )}
        </div>
      </div>
    ),
  },
};

// Different sizes showcase
export const DifferentSizes: Story = {
  args: {
    options: basicOptions,
  },
  render: () => {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");

    return (
      <div className="space-y-4 min-w-96">
        <div>
          <label className="block text-sm font-medium mb-2">Small (w-60)</label>
          <div className="w-60">
            <AutoComplete
              value={value1}
              onValueChange={setValue1}
              options={basicOptions}
              placeholder="Small autocomplete..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Medium (w-80)
          </label>
          <div className="w-80">
            <AutoComplete
              value={value2}
              onValueChange={setValue2}
              options={basicOptions}
              placeholder="Medium autocomplete..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Large (w-96)</label>
          <div className="w-96">
            <AutoComplete
              value={value3}
              onValueChange={setValue3}
              options={basicOptions}
              placeholder="Large autocomplete..."
            />
          </div>
        </div>
      </div>
    );
  },
};

// Interactive playground
export const Interactive: Story = {
  args: {
    options: countriesOptions,
  },
  render: () => {
    const [value, setValue] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [showError, setShowError] = useState(false);

    return (
      <div className="space-y-4 min-w-96">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Interactive AutoComplete
          </h3>

          <div className="w-80">
            <AutoComplete
              value={value}
              onValueChange={(newValue, option) => {
                setValue(newValue);
                console.log("Selected:", { value: newValue, option });
              }}
              options={countriesOptions}
              placeholder="Pilih negara..."
              disabled={disabled}
              error={showError ? "Pilihan harus diisi" : undefined}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm">
              <strong>Selected Value:</strong> {value || "None"}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                />
                Disabled
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showError}
                  onChange={(e) => setShowError(e.target.checked)}
                />
                Show Error
              </label>
            </div>

            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-sm text-sm"
              onClick={() => setValue("")}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    );
  },
};

// All states showcase
export const AllStates: Story = {
  args: {
    options: basicOptions,
  },
  render: () => {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("banana");
    const [value3, setValue3] = useState("");
    const [value4, setValue4] = useState("apple");

    return (
      <div className="grid grid-cols-2 gap-6 min-w-[800px]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Default State
            </label>
            <AutoComplete
              value={value1}
              onValueChange={setValue1}
              options={basicOptions}
              placeholder="Pilih buah..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              With Selection
            </label>
            <AutoComplete
              value={value2}
              onValueChange={setValue2}
              options={basicOptions}
              placeholder="Pilih buah..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">With Error</label>
            <AutoComplete
              value={value3}
              onValueChange={setValue3}
              options={basicOptions}
              placeholder="Pilih buah..."
              error="Pilihan harus diisi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disabled</label>
            <AutoComplete
              value={value4}
              onValueChange={setValue4}
              options={basicOptions}
              placeholder="Pilih buah..."
              disabled={true}
            />
          </div>
        </div>
      </div>
    );
  },
};
