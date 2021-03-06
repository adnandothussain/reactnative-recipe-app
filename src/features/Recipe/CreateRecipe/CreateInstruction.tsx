import * as React from "react";
import { View, StyleSheet } from "react-native";

import FlexStyles from "src/components/FlexBox/FlexStyles";
import { TouchableIcon } from "src/components/Icon";
import TextInput from "src/components/TextInput";
import Typography from "src/components/Typography";
import { COLORS } from "src/constants/colors";
import { typographyStyles } from "src/constants/globalStyles";
import { useTogglState } from "src/hooks/useToggleState";
import { moderateScale } from "src/utils/scale";
import { styles as commonStyles } from "./styles";
import Spacer from "src/components/Spacer";

type CreateInstructionProps = {
  index: number;
  instruction: string;
  allowDelete?: boolean;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onChange: (value: string) => void;
};

export const CreateInstruction: React.FC<CreateInstructionProps> = ({
  index,
  allowDelete,
  onDelete,
  onChange,
  instruction,
}) => {
  const [editable, toggleEditable] = useTogglState(true);

  return (
    <React.Fragment>
      {editable ? (
        <View>
          <View
            style={[
              FlexStyles.flexDirectionRow,
              FlexStyles.justifyContentSpaceBetween,
            ]}
          >
            <Typography
              variant="P"
              color={COLORS.statsGreySecondary}
              marginBottom={moderateScale(8)}
            >
              Step {index + 1}
            </Typography>
            <TouchableIcon
              type="Fontisto"
              name="close"
              size={15}
              disabled={!allowDelete}
              color={
                allowDelete ? COLORS.primaryRed : COLORS.statsGreySecondary
              }
              onPress={() => onDelete(index)}
              style={{
                marginRight: moderateScale(10),
              }}
            />
          </View>
          <TextInput
            placeholder="Instruction..."
            containerStyle={commonStyles.input}
            style={typographyStyles.P}
            autoFocus
            onBlur={() => {
              if (instruction.trim().length) {
                toggleEditable();
              }
            }}
            value={instruction}
            onChangeText={onChange}
          />
        </View>
      ) : (
        <View
          style={[
            FlexStyles.flexDirectionRow,
            FlexStyles.justifyContentSpaceBetween,
            styles.step,
          ]}
        >
          <Typography
            variant="P"
            color={COLORS.statsGreyPrimary}
            marginRight={moderateScale(5)}
            fontSize={moderateScale(14)}
            letterSpacing={moderateScale(1.2)}
          >
            {index + 1} ) {instruction}
          </Typography>
          <View style={FlexStyles.flexDirectionRow}>
            <TouchableIcon
              type="Feather"
              name="edit"
              size={15}
              color={COLORS.statsGreyPrimary}
              onPress={toggleEditable}
              style={{
                color: COLORS.statsGreyPrimary,
                fontSize: moderateScale(15),
                marginLeft: moderateScale(10),
              }}
            />
            <Spacer size={8} />
            <TouchableIcon
              type="Fontisto"
              name="close"
              size={15}
              disabled={!allowDelete}
              color={
                allowDelete ? COLORS.primaryRed : COLORS.statsGreySecondary
              }
              onPress={() => onDelete(index)}
              style={{
                marginLeft: moderateScale(10),
              }}
            />
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  step: {
    marginBottom: moderateScale(10),
    padding: moderateScale(12),
    backgroundColor: COLORS.white,
  },
});
