const ApiError = require('../../common/ApiError');
const splitRepository = require('./split.repository');

const listAll = () => splitRepository.findAllSorted();

const listMine = (userId) => splitRepository.findForParticipant(userId);

const createSplit = async (body, user) => {
  const totalShares = body.participants.reduce((sum, p) => sum + p.share, 0);
  if (Math.abs(totalShares - body.totalAmount) > 0.01) {
    throw ApiError.badRequest('Participant shares must add up to the total amount');
  }

  return splitRepository.create({ ...body, createdBy: user._id });
};

const settleShare = async (splitId, user, requestedParticipantId) => {
  const split = await splitRepository.findById(splitId);
  if (!split) {
    throw ApiError.notFound('Split expense not found');
  }

  if (requestedParticipantId && user.role !== 'Admin' && requestedParticipantId !== user._id.toString()) {
    throw ApiError.forbidden('You can only settle your own share');
  }

  const targetUserId = requestedParticipantId || user._id.toString();

  const participant = split.participants.find((p) => p.user.toString() === targetUserId);
  if (!participant) {
    throw ApiError.forbidden('You are not a participant in this split');
  }

  participant.settled = true;
  split.status = split.participants.every((p) => p.settled) ? 'Settled' : 'Open';
  await split.save();

  return splitRepository.findById(splitId)
    .then((s) => s.populate('paidBy', 'name email').then(() => s.populate('participants.user', 'name email')));
};

module.exports = { listAll, listMine, createSplit, settleShare };
