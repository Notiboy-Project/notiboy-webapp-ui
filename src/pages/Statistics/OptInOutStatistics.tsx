import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Flex, Text } from "@chakra-ui/react";
import { UserContext } from "../../Context/userContext";
import {
  fetchOptInOutStats,
  optinOutStatsDto,
} from "../../services/statistics.service";
import SelectChannel from "../../components/SelectChannel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Opted in out Chart",
    },
    label: {
      display: false,
    },
  },
};

const optin_out_colors = {
  optout: "rgba(255, 99, 132, 0.5)",
  optin: "rgba(53, 162, 235, 0.5)",
};

export default function OptInOutStatistics({
  activeIndex,
}: {
  activeIndex: number;
}) {
  const { user } = useContext(UserContext);
  const [showChart, setShowChart] = useState(false);
  const [currentChannel, setCurrentChannel] = useState("");
  const [dataset, setDataSet] = useState<{
    labels: string[];
    optin: number[];
    optout: number[];
  }>({
    labels: [],
    optin: [],
    optout: [],
  });

  const { data: stats } = useSWR(
    currentChannel ? `${user?.chain}/${currentChannel}/opt-in-out/stat` : null,
    fetchOptInOutStats,
    {
      revalidateOnFocus: false,
      fallbackData: {
        optInOut: [],
        totalUsers: 0,
      },
    }
  );

  const formatAndSetData = (optInOut: optinOutStatsDto[]) => {
    if (optInOut.length < 3) {
      setShowChart(false);
      setDataSet({
        labels: [],
        optin: [],
        optout: [],
      });
      return;
    }

    const optout: number[] = optInOut.map((c) => c.optout);
    const optin: number[] = optInOut.map((c) => c.optin);
    const _date: string[] = optInOut.map((c) => c.date);

    setDataSet({
      labels: _date || [],
      optin: optin || [],
      optout: optout || [],
    });
    setShowChart(true);
  };

  const data = {
    labels: dataset.labels,
    datasets: [
      {
        // label: 'Number of Users',
        data: dataset.optout,
        borderColor: optin_out_colors.optout,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        // label: 'Number of announcements',
        data: dataset.optin,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: optin_out_colors.optin,
      },
    ],
  };

  useEffect(() => {
    formatAndSetData(stats?.optInOut || []);
  }, [stats, activeIndex]);

  return (
    <Box w={{ base: "100%", md: "65%" }} margin={"0 auto"}>
      <Flex justifyContent={"end"} width={"fit-content"}>
        <SelectChannel onChannelSelect={setCurrentChannel} />
      </Flex>
      <Text my={2} as={"p"} textAlign={"center"}>
        Current Users: <b>{stats?.totalUsers || 0}</b>
      </Text>
      <Flex mt={5} justifyContent={"center"} alignItems={"center"} mb={3}>
        <Box
          borderRadius={"full"}
          height={"10px"}
          width={"10px"}
          backgroundColor={optin_out_colors.optin}
          mr={2}
        />
        <Text mr={4}>Opted-in</Text>
        <Box
          borderRadius={"full"}
          height={"10px"}
          width={"10px"}
          backgroundColor={optin_out_colors.optout}
          mr={2}
        />
        <Text>Opted-out</Text>
      </Flex>
      <Flex minHeight={300} alignItems={"center"} justifyContent={"center"}>
        <Line
          options={options}
          data={data}
          updateMode="resize"
          style={{ maxHeight: '450px', minHeight: '350px' }}
        />
        {!showChart && (
          <Text position={"absolute"}>Chart data not yet available !</Text>
        )}
      </Flex>
      <Text mt={2} fontWeight={600} textAlign={"center"}>
        User Opt-in Opt-out Statistics
      </Text>
    </Box>
  );
}
