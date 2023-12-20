import { useEffect, useState } from 'react';

export const useFetchDummyData = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reETHConversionAmount, setReETHConversionAmount] = useState<
    number | null
  >(null);

  const fetchDummyData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
      .then(() => {
        setIsLoading(false);
        setIsError(false);
        setReETHConversionAmount(1.05);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await fetchDummyData().then(() => {
        console.log('fetchDummyData completed');
      });
    };
    fetchData().catch(console.error);
  }, []);

  return { isLoading, isError, data: reETHConversionAmount };
};
