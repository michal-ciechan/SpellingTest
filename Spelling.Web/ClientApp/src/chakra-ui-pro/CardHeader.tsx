import { Flex, Heading } from '@chakra-ui/react'
import * as React from 'react'

interface Props {
  title: string
  action?: React.ReactNode
}

export const CardHeader = (props: Props) => {
  const { title, action } = props
  return (
    <Flex justify="space-between" px="6" py="4" borderBottomWidth="1px" justifyContent="center">
      <Heading as="h2" fontSize="lg" textAlign={'center'} justifyContent="center" justifySelf={'center'} alignSelf={'center'}>
        {title}
      </Heading>
      {action}
    </Flex>
  )
}
