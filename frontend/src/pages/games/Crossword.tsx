import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { varGray1, varRed } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";

function Crossword({ navigation }: NavProp) {
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [rowOrientation, setRowOrientation] = useState<boolean>(true);
  const crosswordRef = useRef<{ [key: string]: TextInput | null }>({});
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastClickKey, setLastClickKey] = useState<string | null>(null);
  const [cellValues, setCellValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    focusedCell &&
      crosswordRef.current[focusedCell]?.setNativeProps({
        selection: { start: 1, end: 1 },
      });
    focusedCell && crosswordRef.current[focusedCell]?.focus();
  }, [focusedCell]);

  return (
    <View>
      <View style={styles.gamesPage}>
        <View style={styles.grid}>
          {Array(5)
            .fill(null)
            .map((_, rowIndex) => (
              <View style={styles.row} key={rowIndex}>
                {Array(5)
                  .fill(null)
                  .map((_, colIndex) => {
                    const cellKey = `${rowIndex}-${colIndex}`;
                    return (
                      <TextInput
                        ref={(ref) => (crosswordRef.current[cellKey] = ref)}
                        key={cellKey}
                        selectTextOnFocus={false}
                        editable
                        style={[
                          styles.cell,
                          rowOrientation &&
                            focusedCell?.split("-")[0] === `${rowIndex}` &&
                            styles.focusedRow,
                          !rowOrientation &&
                            focusedCell?.split("-")[1] === `${colIndex}` &&
                            styles.focusedRow,
                          focusedCell === cellKey && styles.focusedCell,
                        ]}
                        maxLength={1}
                        keyboardType="default"
                        onFocus={() => setFocusedCell(cellKey)}
                        onBlur={() => setFocusedCell(null)}
                        onChangeText={(text) => {
                          var newRow, newCol;
                          if (text.length == 1) {
                            newRow =
                              rowOrientation || rowIndex == 4
                                ? rowIndex
                                : rowIndex + 1;
                            newCol =
                              !rowOrientation || colIndex == 4
                                ? colIndex
                                : colIndex + 1;
                          } else {
                            newRow =
                              rowOrientation || rowIndex == 0
                                ? rowIndex
                                : rowIndex - 1;
                            newCol =
                              !rowOrientation || colIndex == 0
                                ? colIndex
                                : colIndex - 1;
                          }
                          setCellValues((prevValues) => ({
                            ...prevValues,
                            [cellKey]: text,
                          }));
                          setFocusedCell(`${newRow}-${newCol}`);
                        }}
                        onKeyPress={({ nativeEvent }) => {
                          if (
                            (!cellValues[cellKey] ||
                              cellValues[cellKey].length == 0) &&
                            nativeEvent.key === "Backspace"
                          ) {
                            var newRow =
                              rowOrientation || rowIndex == 0
                                ? rowIndex
                                : rowIndex - 1;
                            var newCol =
                              !rowOrientation || colIndex == 0
                                ? colIndex
                                : colIndex - 1;
                            setFocusedCell(`${newRow}-${newCol}`);
                          }
                        }}
                        onPress={() => {
                          if (`${rowIndex}-${colIndex}` == focusedCell) {
                            crosswordRef.current[
                              `${rowIndex}-${colIndex}`
                            ]?.blur();
                            setClickCount(clickCount + 1);
                            if (
                              clickCount == 1 &&
                              `${rowIndex}-${colIndex}` == lastClickKey
                            ) {
                              setRowOrientation(!rowOrientation);
                              setClickCount(1);
                            } else if (
                              `${rowIndex}-${colIndex}` != lastClickKey
                            ) {
                              setClickCount(1);
                            }
                            setLastClickKey(`${rowIndex}-${colIndex}`);
                            console.log(clickCount);
                            console.log(rowOrientation);
                          } else {
                            setFocusedCell(`${rowIndex}-${colIndex}`);
                            crosswordRef.current[
                              `${rowIndex}-${colIndex}`
                            ]?.focus();
                            crosswordRef.current[
                              `${rowIndex}-${colIndex}`
                            ]?.setSelection(1, 1);
                            setClickCount(1);
                            setLastClickKey(`${rowIndex}-${colIndex}`);
                          }
                        }}
                      />
                    );
                  })}
              </View>
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gamesPage: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "column",
    borderWidth: 1,
    width: 251,
    height: 251,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 0.25,
    borderColor: "black",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 32,
  },
  focusedCell: {
    backgroundColor: "#F47B7F",
    opacity: 1.0,
  },
  focusedRow: {
    backgroundColor: varGray1,
  },
});

export default Crossword;
