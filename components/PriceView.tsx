import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount?: number | undefined;
  className?: string;
}
const PriceView = ({ price, className }: Props) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <PriceFormatter amount={price} className={className} />
    </div>
  );
};

export default PriceView;
