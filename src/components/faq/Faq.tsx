import { useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

const FAQs: { question: string; answer: string }[] = [
  {
    question: 'What is Swell Network?',
    answer:
      'Swell Network is a permissionless, non-custodial, and liquid ETH staking protocol built for stakers, node operators, and the Ethereum ecosystem.',
  },
  {
    question: 'How does Swell work?',
    answer:
      'Swell Network represents next generation ETH staking: Staking 2.0. When you stake ETH with Swell, you will receive a Swell NFT (swNFT) which contains Swell ETH (swETH.) Your swNFT is a financial NFT which holds your ETH assets in a liquid manner for further yield across DeFi. With Swell, you are able to directly do this within the Swell DApp by tapping into Swell Vaults ',
  },
  {
    question: 'What is swETH?',
    answer:
      'Swell ETH (swETH) is a liquid staking derivative token representing your staked ETH. swETH is redeemable on a 1 to 1 basis with ETH.',
  },
  {
    question: 'What is a swNFT?',
    answer:
      'Swell NFT (swNFT) is a financial NFT that contains your swETH and represents your position across validators on a permissionless network of node operators interfacing with Ethereum’s Proof of Stake (PoS) consensus mechanism. Your swNFT can be deposited into Swell Vaults for compounded yield, all in one place.',
  },
  {
    question: 'What is swDAO?',
    answer:
      'Swell DAO (swDAO) is the protocol governance token for Swell Network. swDAO token holders are able to govern and direct the protocol in accordance with relevant parameters.',
  },
  {
    question: 'Is Swell secure?',
    answer:
      'Swell maintains security as the highest virtue of the protocol. Swell has completed numerous audits and is subject to ongoing audit and assurance to maximise safety and security.',
  },
  {
    question: 'What are the risks of staking with Swell?',
    answer:
      'As with any decentralized finance application, staking involves inherent risk. This includes smart contract risk, market risk, technology risk, and more.',
  },
  {
    question: 'What fee is applied by Swell?',
    answer: 'Swell applies a 10% commission on staking rewards earned by the protocol.',
  },
  {
    question: 'How can I convert my swETH back to ETH?',
    answer:
      'ETH that is staked on the Beacon Chain cannot be withdrawn. However, with Swell’s liquid staking solution, you may convert your swETH back to ETH on liquidity pools such as Uniswap.',
  },
];

const Faq: React.FC = () => {
  const [loadMore, setLoadMore] = useState<boolean>(true);

  const handleLoadMore = (load: boolean) => {
    setLoadMore(load);
  };
  const faqs = loadMore ? FAQs.slice(0, 2) : FAQs;
  return (
    <Card>
      <CardHeader sx={{ '& span': { marginBottom: 0 } }} title="FAQ" />
      <CardContent>
        {faqs.map((faq) => (
          <Accordion key={faq.question}>
            <AccordionSummary
              expandIcon={
                <ExpandMore
                  sx={{
                    background: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.primary.main,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                  }}
                />
              }
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        {loadMore ? (
          <Button
            onClick={() => handleLoadMore(false)}
            size="small"
            sx={{ fontWeight: 500, marginTop: '20px', padding: 0 }}
            variant="text"
          >
            View more
          </Button>
        ) : (
          <Button
            onClick={() => handleLoadMore(true)}
            size="small"
            sx={{ fontWeight: 500, marginTop: '20px', padding: 0 }}
            variant="text"
          >
            View less
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Faq;
