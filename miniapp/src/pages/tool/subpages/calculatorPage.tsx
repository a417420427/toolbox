import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { CalculatorTool } from '@/utils/tools/calculatorTool';
import toolStyles from '@/styles/tool-common.module.scss';

const CalculatorPage: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [a, setA] = useState(0);
  const [op, setOp] = useState<string | null>(null);
  const [waitingB, setWaitingB] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  const input = (val: string) => {
    if (waitingB) {
      setDisplay(val);
      setWaitingB(false);
    } else {
      setDisplay(d => d === '0' && val !== '.' ? val : d + val);
    }
  };

  const operator = (opLabel: string) => {
    if (op !== null && !waitingB) evaluate();
    setA(parseFloat(display));
    setOp(opLabel);
    setWaitingB(true);
  };

  const evaluate = () => {
    if (op === null) return;
    const b = parseFloat(display);
    const r = CalculatorTool.calculate(a, op, b);
    setDisplay(r.error || CalculatorTool.formatResult(r.result));
    setOp(null);
    setWaitingB(false);
  };

  const clear = () => {
    setDisplay('0'); setA(0); setOp(null); setWaitingB(false);
  };

  const backspace = () => {
    setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
  };

  const sci = (func: string) => {
    const val = parseFloat(display);
    const r = CalculatorTool.scientific(func, val);
    setDisplay(r.error || CalculatorTool.formatResult(r.result));
  };

  const btn = (label: string, onClick: () => void, extraStyle = '') => (
    <Text
      className={`${toolStyles.calcBtn} ${extraStyle}`}
      onClick={onClick}
    >{label}</Text>
  );

  return (
    <View>
      <View className={toolStyles.calcDisplay}>
        <Text className={toolStyles.calcDisplayText}>{display}</Text>
      </View>
      <Text className={toolStyles.chip} onClick={() => setShowScientific(!showScientific)}
        style={{ marginBottom: '8rpx', display: 'inline-block' }}>
        {showScientific ? '收起科学' : '科学计算'} ▾
      </Text>
      {showScientific && (
        <View>
          <View className={toolStyles.calcRow}>
            {['sin', 'cos', 'tan', 'sqrt'].map(f => btn(f, () => sci(f), toolStyles.calcSciBtn))}
          </View>
          <View className={toolStyles.calcRow}>
            {['log', 'ln', 'x²', 'x³'].map(f => btn(f, () => sci(f), toolStyles.calcSciBtn))}
          </View>
          <View className={toolStyles.calcRow}>
            {['1/x', 'x!', '|x|', '^'].map(f => btn(f, () => {
              if (f === '^') return operator('^');
              const sciMap: Record<string, string> = { '1/x': 'reciprocal', 'x!': 'factorial', '|x|': 'abs' };
              sci(sciMap[f]);
            }, toolStyles.calcSciBtn))}
          </View>
        </View>
      )}
      <View className={toolStyles.calcRow}>
        {btn('C', clear, toolStyles.calcSpecialBtn)}
        {btn('⌫', backspace, toolStyles.calcSpecialBtn)}
        {btn('%', () => operator('%'), toolStyles.calcOpBtn)}
        {btn('÷', () => operator('÷'), toolStyles.calcOpBtn)}
      </View>
      <View className={toolStyles.calcRow}>
        {btn('7', () => input('7'))}
        {btn('8', () => input('8'))}
        {btn('9', () => input('9'))}
        {btn('×', () => operator('×'), toolStyles.calcOpBtn)}
      </View>
      <View className={toolStyles.calcRow}>
        {btn('4', () => input('4'))}
        {btn('5', () => input('5'))}
        {btn('6', () => input('6'))}
        {btn('−', () => operator('−'), toolStyles.calcOpBtn)}
      </View>
      <View className={toolStyles.calcRow}>
        {btn('1', () => input('1'))}
        {btn('2', () => input('2'))}
        {btn('3', () => input('3'))}
        {btn('+', () => operator('+'), toolStyles.calcOpBtn)}
      </View>
      <View className={toolStyles.calcRow}>
        {btn('0', () => input('0'), toolStyles.calcZeroBtn)}
        {btn('.', () => input('.'))}
        {btn('=', evaluate, toolStyles.calcEqBtn)}
      </View>
    </View>
  );
};

export default CalculatorPage;
