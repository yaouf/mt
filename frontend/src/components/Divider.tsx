import { View } from 'react-native';

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  color?: string;
};

function Divider({ marginTop, marginBottom, color }: DividerProps) {
  return (
    <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color !== undefined ? color : '#ddd',
          marginVertical: 20,
        }}
      />
    </View>
  );
}

export default Divider;
