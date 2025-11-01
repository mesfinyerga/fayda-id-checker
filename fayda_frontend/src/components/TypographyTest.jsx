import React from 'react';
import { Box, Card, CardContent, Stack, Chip, Divider } from '@mui/material';
import Layout from './layout/Layout';
import PageHeader from './layout/PageHeader';
import {
  Typography,
  Display1,
  Display2,
  Display3,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body1,
  Body2,
  Caption,
  Overline,
  Subtitle1,
  Subtitle2,
  ButtonText,
  Link,
  ErrorText,
  SuccessText,
  WarningText,
  InfoText,
  SecondaryText,
  ResponsiveText,
  TextGroup
} from './Typography';

const TypographyTest = () => {
  return (
    <Layout>
      <PageHeader
        title="Typography System Test"
        subtitle="This page demonstrates the comprehensive typography system including all variants, responsive typography, and text utilities."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Typography Test', href: '/typography-test' }
        ]}
      />

      {/* Display Typography */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Display Typography</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Display1>Display 1 - Large attention-grabbing text</Display1>
              <Display2>Display 2 - Medium display text</Display2>
              <Display3>Display 3 - Small display text</Display3>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Heading Hierarchy */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Heading Hierarchy</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <H1>Heading 1 - Main page title</H1>
              <H2>Heading 2 - Section title</H2>
              <H3>Heading 3 - Subsection title</H3>
              <H4>Heading 4 - Card title</H4>
              <H5>Heading 5 - Small title</H5>
              <H6>Heading 6 - Smallest title</H6>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Body Text */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Body Text</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Body1>
                Body 1 - This is the primary body text used for most content. It provides good readability 
                and is suitable for paragraphs, descriptions, and general content.
              </Body1>
              <Body2>
                Body 2 - This is secondary body text, slightly smaller than Body 1. It's used for 
                supporting content, captions, and less prominent text.
              </Body2>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Subtitle and Caption */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Subtitle and Caption</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Subtitle1>Subtitle 1 - Used for section subtitles and emphasis</Subtitle1>
              <Subtitle2>Subtitle 2 - Smaller subtitle for less emphasis</Subtitle2>
              <Caption>Caption - Small text for captions, metadata, and annotations</Caption>
              <Overline>Overline - Uppercase text with letter spacing for labels</Overline>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Specialized Text Components */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Specialized Text Components</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Link href="#example">Link Text - Clickable link with hover effects</Link>
              <ErrorText>Error Text - Used for error messages and warnings</ErrorText>
              <SuccessText>Success Text - Used for success messages and confirmations</SuccessText>
              <WarningText>Warning Text - Used for warning messages and alerts</WarningText>
              <InfoText>Info Text - Used for informational messages and tips</InfoText>
              <SecondaryText>Secondary Text - Used for less prominent information</SecondaryText>
              <ButtonText>Button Text - Text styling for buttons</ButtonText>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Responsive Typography */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Responsive Typography</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <ResponsiveText
                variant="h1"
                mobileVariant="h3"
                tabletVariant="h2"
                desktopVariant="h1"
              >
                Responsive Heading - Adapts to screen size
              </ResponsiveText>
              <ResponsiveText
                variant="body1"
                mobileVariant="body2"
                tabletVariant="body1"
                desktopVariant="body1"
              >
                Responsive Body Text - This text will be smaller on mobile devices and larger on desktop.
              </ResponsiveText>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Text Group Example */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Text Group with Consistent Spacing</H2>
        <Card>
          <CardContent>
            <TextGroup spacing={2} align="left">
              <H3>Article Title</H3>
              <Subtitle1 color="text.secondary">Article subtitle with description</Subtitle1>
              <Body1>
                This is the main content of the article. The TextGroup component provides consistent 
                spacing between text elements and can be aligned as needed.
              </Body1>
              <Caption color="text.secondary">Published on December 19, 2024</Caption>
            </TextGroup>
          </CardContent>
        </Card>
      </Box>

      {/* Typography Utilities */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Typography Utilities</H2>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography
                variant="h3"
                color="primary.main"
                align="center"
                weight={600}
                transform="uppercase"
                letterSpacing="wide"
              >
                Custom Styled Text
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                align="justify"
                lineHeight={1.8}
                gutterBottom
              >
                This text demonstrates various typography utilities including custom colors, 
                alignment, font weight, text transform, letter spacing, and line height. 
                The typography system provides flexible styling options for different use cases.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Typography Scale */}
      <Box sx={{ mb: 4 }}>
        <H2 gutterBottom>Typography Scale</H2>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Display 1" size="small" />
                <Display1>56px / 700 weight</Display1>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Display 2" size="small" />
                <Display2>48px / 700 weight</Display2>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Display 3" size="small" />
                <Display3>40px / 600 weight</Display3>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H1" size="small" />
                <H1>36px / 600 weight</H1>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H2" size="small" />
                <H2>30px / 600 weight</H2>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H3" size="small" />
                <H3>24px / 600 weight</H3>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H4" size="small" />
                <H4>20px / 600 weight</H4>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H5" size="small" />
                <H5>18px / 600 weight</H5>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="H6" size="small" />
                <H6>16px / 600 weight</H6>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Body 1" size="small" />
                <Body1>16px / 400 weight</Body1>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Body 2" size="small" />
                <Body2>14px / 400 weight</Body2>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Caption" size="small" />
                <Caption>12px / 400 weight</Caption>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Usage Examples */}
      <Box>
        <H2 gutterBottom>Usage Examples</H2>
        <Card>
          <CardContent>
            <H4 gutterBottom>Code Examples</H4>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'neutral.50',
                borderRadius: 1,
                fontSize: '0.875rem',
                overflow: 'auto'
              }}
            >
{`// Basic usage
<H1>Page Title</H1>
<Body1>Main content text</Body1>
<Caption>Small caption text</Caption>

// Responsive typography
<ResponsiveText
  variant="h1"
  mobileVariant="h3"
  tabletVariant="h2"
  desktopVariant="h1"
>
  Responsive heading
</ResponsiveText>

// Text group with consistent spacing
<TextGroup spacing={2} align="center">
  <H2>Section Title</H2>
  <Body1>Section description</Body1>
</TextGroup>

// Custom styling
<Typography
  variant="h3"
  color="primary.main"
  align="center"
  weight={600}
  transform="uppercase"
>
  Custom styled text
</Typography>`}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default TypographyTest;
